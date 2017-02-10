export default function TopicNotFoundError (message) {
  this.name = 'TopicNotFoundError';
  this.message = message;
  this.stack = (new Error()).stack;
}

TopicNotFoundError.prototype = Object.create(Error.prototype);
TopicNotFoundError.prototype.constructor = TopicNotFoundError;