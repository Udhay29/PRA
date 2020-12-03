import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';

import * as utils from 'lodash';

import { ErrorHandlerService } from './error-handler.service';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private readonly errorHandlerService: ErrorHandlerService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(() => { }, (response) => {
            if (response instanceof HttpErrorResponse) {
                if ((response.status) && (response.error)) {
                  const statusText = response.status === 503 ?
                  'Application currently unavailable. Please contact JBH Helpdesk' : response.status === 403 ?
                  'Error encountered in accessing enterprise api. Please contact help desk'
                  : response.statusText;
                  const errorObject = [{
                    statusText: 'Error',
                    message: (utils.isString(response.error)) ? statusText : (response.error.error) ?
                    response.error.error : response.error.errors[0].errorMessage
                  }];
                  this.errorHandlerService.addErrors(errorObject);
                  return;
                }
            }

            return throwError(response);
        }));
    }
}
