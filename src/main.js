const express = require("express");
const { port, host, proxyOptions } = require("./config");
const axios = require("axios");
const { isValidUrl, getSizeInBytes } = require("./utils");
const { start: startTelemetry, stop: stopTelemetry } = require("./telemetry");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const { startAutocleanupActiveSpan } = require("./telemetry/utils");
const { BadRequest } = require("./exceptions");
const { connect } = require("net");
const http = require("http");

/**
 * Logger.
 * TODO: proper logger
 * @type {Console | console}
 */
const logger = console;

/**
 * Create an express app.
 * @type {*|Express}
 */
const defaultHandler = express();

/**
 * Add a body parser to the express app.
 */
defaultHandler.use(bodyParser.json());
defaultHandler.use(bodyParser.urlencoded({ extended: true }));

/**
 * Add rate limiter to the express app (number of concurrent requests).
 * Rate-limits per IP address.
 *
 * Alternative approach: rate-limit per concurrent active requests.
 */
defaultHandler.use(
  rateLimit({
    windowMs: proxyOptions.windowDurationInMilliseconds,
    max: proxyOptions.maxRequestsPerWindow,
    standardHeaders: true,
  })
);

defaultHandler.all("*", async (req, res, next) => {
  try {
    await startAutocleanupActiveSpan("proxy.regular", async (span) => {
      /**
       * Extract the destination from the request object.
       */
      const { method, url, headers, body } = req;
      span.setAttributes({ method, url });
      logger.debug({ method, url, headers, body });
      /**
       * Raise an exception if the data is not provided properly.
       * Properly validates the url.
       */
      if (!isValidUrl(url)) {
        throw new BadRequest("Invalid URL");
      }

      /**
       * Check if the request body is too large.
       */
      if (getSizeInBytes(JSON.stringify(body)) > proxyOptions.maxRequestSizeInBytes) {
        throw new BadRequest("Request body too large");
      }

      /**
       * Send the request to the destination.
       */
      const response = await axios({
        method,
        url,
        headers,
        data: body,
        timeout: proxyOptions.requestTimeoutInMilliseconds,
        responseType: "stream",
      });

      /**
       * Return the response from the destination to the client.
       */

      res.status(response.status);
      response.data.pipe(res);
    });
  } catch (e) {
    /**
     * Ugly a** way to handle exceptions.
     */
    next(e);
  }
});

/**
 * Create the http server wrapper.
 * @type {Server<typeof IncomingMessage, typeof ServerResponse>}
 */
const proxy = http.createServer(defaultHandler);

/**
 * Handle tunneling.
 */
proxy.on("connect", async (req, clientSocket, head) => {
  try {
    await startAutocleanupActiveSpan("proxy.connect", async (span) => {
      /**
       * Extract the destination from the request object.
       */
      const { url } = req;
      const [hostname, port] = url.split(":");
      span.setAttributes({ url, hostname, port });
      logger.debug({ url, hostname, port });

      /**
       * Create a connection to the destination.
       * @type {Socket}
       */
      const serverSocket = connect(port, hostname, () => {
        clientSocket.write(
          "HTTP/1.1 200 Connection Established\r\n" +
            "Proxy-agent: Node.js-Proxy\r\n" +
            "\r\n"
        );
        serverSocket.write(head);
        /**
         * Intercept the data if needed (aka man-in-the-middle).
         */
        serverSocket.pipe(clientSocket);
        clientSocket.pipe(serverSocket);
      });
    });
  } catch (e) {
    /**
     * Close the connection if an error occurs.
     */
    clientSocket.end();
  }
});

(async () => {
  /**
   * Start the telemetry.
   */
  await startTelemetry();
  /**
   * Start the server.
   */
  proxy.listen(port, () => {
    console.log(`Proxy server running on http://${host}:${port}`);
  });
  /**
   * Gracefully shutdown the server.
   */
  process.on("SIGTERM", async () => {
    await stopTelemetry();
    process.exit(0);
  });
})();
