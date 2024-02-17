import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodIssueBase, ZodIssueOptionalMessage } from 'zod';

declare const ZodHttpIssueCode: {
  unique_constraint: 'unique_constraint';
  invalid_credentials: 'invalid_credentials';
  not_found: 'not_found';
  token_expired: 'token_expired';
};

type ZodHttpIssueCode = keyof typeof ZodHttpIssueCode;

export interface ZodUniqueIssue extends ZodIssueBase {
  code: typeof ZodHttpIssueCode.unique_constraint;
}

export interface ZodInvalidCredentialsIssue extends ZodIssueBase {
  code: typeof ZodHttpIssueCode.invalid_credentials;
}

export interface ZodNotFoundIssue extends ZodIssueBase {
  code: typeof ZodHttpIssueCode.not_found;
}

export interface ZodTokenExpiredIssue extends ZodIssueBase {
  code: typeof ZodHttpIssueCode.token_expired;
}

type ZodHttpIssueOptionalMessage =
  | ZodIssueOptionalMessage
  | ZodUniqueIssue
  | ZodInvalidCredentialsIssue
  | ZodNotFoundIssue
  | ZodTokenExpiredIssue;

type ZodHttpIssue = ZodHttpIssueOptionalMessage & {
  fatal?: boolean;
  message: string;
};

export class ZodHttpException extends HttpException {
  constructor(
    statusCode: keyof typeof HttpStatus,
    errors: ZodHttpIssue[],
    message?: string,
  ) {
    const status = HttpStatus[statusCode];
    const response = {
      statusCode: status,
      message: message || statusCode,
      errors: errors,
    };
    super(response, status);
  }
}
