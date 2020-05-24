import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { QueryFailedError } from 'typeorm';

@Catch(EntityNotFoundError, QueryFailedError)
export class TypeORMFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      response
        .status(HttpStatus.NOT_FOUND)
        .json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Not Found',
        });
    }

    if (exception instanceof QueryFailedError) {
      const DUPLICATED_FIELDS_CONFLICT = '23505';
      if ((exception as any).code === DUPLICATED_FIELDS_CONFLICT) {
        response
          .status(HttpStatus.CONFLICT)
          .json({
            statusCode: HttpStatus.CONFLICT,
            message: 'Duplicated field value',
          });
      }
    }

  }
}
