const opentelemetry = require("@opentelemetry/sdk-node");

const sdk = new opentelemetry.NodeSDK({
  serviceName: "proxy",
});

async function start() {
  await sdk.start();
}

/**
 * Shutdowns the open telemetry sdk
 */
async function shutdown() {
  return await sdk.shutdown();
}

module.exports = {
  sdk,
  start,
  shutdown,
};
