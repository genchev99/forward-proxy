# Edited Proxy

Using your favourite framework (Express, Fastify, Nest, Koa) implement simple micro service with purpose for man-in-the-middle proxy.
You can choose between TypeScript/Node.js.

### While developing the solution focus on following:
 - performance of the proxy
 - option to extend the proxy with basic measurement collection (number of requests, individual req/res size, time for request)
 - What kind of monitoring this service needs to have (could be implemented code, or just draft ideas written as text on what is important to be tracked and how it could be achieved). What is the number of concurrent requests the service could support? How could it be measured?

Success criteria will be to be able to run the service and fire a HTTPS request through it using curl/insomnia/postman and a browser (chromium).

# Setup

1. Download and install `docker`.
2. Download and install `docker-compose`.
3. Run `./bin/dev_setup.sh` to setup the required environment variables.
4. Run `docker-compose build` to build the docker images.

# Running

1. Run `docker-compose up` to start the service.
2. Run `docker-compose down` to stop the service.

# Smoke testing

1. Run 'docker-compose up' to start the service.
2. Run `./test.sh` (from the root directory) to run the smoke test.

## Grab a drink 🍺
