function getEnv(env, required = false) {
  const value = process.env[env];
  if (required && !value) {
    throw new Error(`Missing required environment variable ${env}`);
  }
  return value;
}

module.exports = {
  env: getEnv("NODE_ENV") || "local",
  port: parseInt(getEnv("PROXY_PORT")) || 3000,
  host: getEnv("PROXY_HOST") || "127.0.0.1",
  otel: {
    serviceName: getEnv("OTEL_SERVICE_NAME") || "proxy",
  },
  proxyOptions: {
    windowDurationInMilliseconds: 60 * 1000, // 1 minute
    maxRequestsPerWindow: 10,
    requestTimeoutInMilliseconds: 30 * 1000, // 30 seconds
    maxRequestSizeInBytes: 1000 * 1000, // 1 MB
    maxResponseSizeInBytes: 1000 * 1000, // 1 MB
  },
};
