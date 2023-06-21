const { trace, SpanStatusCode } = require("@opentelemetry/api");

const defaultTracer = trace.getTracer(__filename);

/**
 * Supports the overload argumnts of the standard otel startActiveSpan
 *
 * The callback is always required and it's always the last argument
 *
 * There are two optional arguments at the beggining (options and context)
 * @returns {{options: *, context: *, cb: *}}
 */
function _mapOverloadedArguments(arg2, arg3, arg4) {
  const args = [arg2, arg3, arg4];

  /**
   * Right trim undefined args
   */
  while (!args[args.length - 1]) {
    args.pop();
  }

  const cb = args.pop();
  const [options = undefined, context = undefined] = args;

  return {
    options,
    context,
    cb,
  };
}

function startAutocleanupActiveSpan(name, arg2, arg3, arg4) {
  const { options, context, cb } = _mapOverloadedArguments(arg2, arg3, arg4);

  const optionalArgs = [options, context].filter((o) => o);
  return defaultTracer.startActiveSpan(name, ...optionalArgs, async (span) => {
    try {
      return await cb(span);
    } catch (err) {
      span.recordException(err);
      span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      throw err;
    } finally {
      span.end();
    }
  });
}

module.exports = {
  startAutocleanupActiveSpan,
};
