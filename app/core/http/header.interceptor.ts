import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const customReq = request.clone({
      headers: request.headers.set('Cache-Control', 'no-cache')
        .set('Pragma', 'no-cache')
    });

    return next.handle(customReq).pipe(tap((event: HttpEvent<any>) => {
    }), catchError((response: any) => {
      return throwError(response);
    }));

  }
}
