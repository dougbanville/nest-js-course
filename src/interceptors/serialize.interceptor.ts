import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  //implements any time we want create a new class that satisfies all the requirements of an abstract class or interface
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //If you ever want to run code before a request goes into a request handler
    //console.log(`I'm running before the handler`);

    return handler.handle().pipe(
      map((data: any) => {
        //console.log(`I'm running before response is sent out`, data);
        return plainToClass(this.dto, data, {
          //We want to exclude the password from the response
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
