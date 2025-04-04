interface InternalServerErrorOptions {
  cause?: unknown;
  statusCode?: number;
}

export class InternalServerError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, statusCode }: InternalServerErrorOptions) {
    super('An unexpected internal error happened.', { cause });
    this.name = 'InternalServerError';
    this.action = 'Get in touch with the support team.';
    this.statusCode = statusCode || 500;
  }

  toJSON(): {
    name: string;
    message: string;
    action: string;
    status_code: number;
  } {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

interface ServiceErrorOptions {
  cause?: unknown;
  message?: string;
}

export class ServiceError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message }: ServiceErrorOptions) {
    super(message || 'Service unavailable at the moment.', { cause });
    this.name = 'ServiceError';
    this.action = 'Verify if the service is available.';
    this.statusCode = 503;
  }

  toJSON(): {
    name: string;
    message: string;
    action: string;
    status_code: number;
  } {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  public action: string;
  public statusCode: number;

  constructor() {
    super('Method not allowed for this endpoint.');
    this.name = 'MethodNotAllowedError';
    this.action = 'Verify if the sent HTTP method is valid for this endpoint.';
    this.statusCode = 405;
  }

  toJSON(): {
    name: string;
    message: string;
    action: string;
    status_code: number;
  } {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

interface ValidationErrorOptions {
  cause?: unknown;
  message?: string;
  action?: string;
}

export class ValidationError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: ValidationErrorOptions) {
    super(message || 'A validation error happened.', { cause });
    this.name = 'ValidationError';
    this.action = action || 'Adjust the submitted data and try again.';
    this.statusCode = 400;
  }

  toJSON(): {
    name: string;
    message: string;
    action: string;
    status_code: number;
  } {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

interface NotFoundErrorOptions {
  cause?: unknown;
  message?: string;
  action?: string;
}

export class NotFoundError extends Error {
  public action: string;
  public statusCode: number;

  constructor({ cause, message, action }: NotFoundErrorOptions) {
    super(message || 'Resource not found', { cause });
    this.name = 'NotFoundError';
    this.action = action || 'Verify if the submitted parameters are correct.';
    this.statusCode = 404;
  }

  toJSON(): {
    name: string;
    message: string;
    action: string;
    status_code: number;
  } {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
