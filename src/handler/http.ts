import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  public statusCode: HttpStatus;
  public message?: string;

  constructor(statusCode: keyof typeof HttpStatus, message?: string) {
    this.statusCode = HttpStatus[statusCode];
    this.message = message;
  }
}
