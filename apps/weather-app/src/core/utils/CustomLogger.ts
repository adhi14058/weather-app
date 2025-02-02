import { Logger } from '@nestjs/common';
import * as httpContext from 'express-http-context';

export class CustomLogger extends Logger {
  private attachRequestContext(message: string) {
    const rId = httpContext.get('requestId') as string;
    const sId = httpContext.get('sessionId') as string;

    return `[ReqID: ${rId}][SessID: ${sId}] ${message}`;
  }
  log(message: string) {
    super.log(this.attachRequestContext(message));
  }
  error(message: string, trace?: string) {
    if (trace) {
      super.error(this.attachRequestContext(message), trace);
    }
    super.error(this.attachRequestContext(message));
  }
  warn(message: string) {
    super.warn(this.attachRequestContext(message));
  }
  debug(message: string) {
    super.debug(this.attachRequestContext(message));
  }
}
