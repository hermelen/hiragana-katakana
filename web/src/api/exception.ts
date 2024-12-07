export class NotFound extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Conflict extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Unauthorized extends Error {
  constructor() {
    super("Unauthorized");
  }
}
