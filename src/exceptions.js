class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequest extends HTTPError {
  constructor(message) {
    super(message, 400);
  }
}

module.exports = {
  HTTPError,
  BadRequest,
};
