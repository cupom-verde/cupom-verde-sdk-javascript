class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class UnexpectedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnexpectedError';
  }
}

module.exports = {
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  ValidationError,
  UnexpectedError,
};
