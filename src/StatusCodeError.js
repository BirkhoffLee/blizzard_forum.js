export default function StatusCodeError (message) {
  this.name = 'StatusCodeError';
  this.message = message;
  this.stack = (new Error()).stack;
}

StatusCodeError.prototype = Object.create(Error.prototype);
StatusCodeError.prototype.constructor = StatusCodeError;