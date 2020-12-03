import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { Location } from '@angular/common';

@Injectable()
export class EsaService {

  constructor(
    private readonly http: HttpClient,
    public userService: UserService,
    location: Location) { }

  load() {
    let esaURL: string;
    let path: string[];
    path = location.pathname.split('/');
    esaURL = '/' + path[1] + '/user';
    if (UserService.URL) {
      esaURL = UserService.URL;
    }

    return new Promise((resolve) => {
        const headers = new HttpHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
        const options =  {
            headers: headers
        };
      this.http.get(esaURL, options)
        .subscribe(data => {
          this.userService.userDetails = data;
          resolve(null);
        }, error => {
          this.userService.userDetails = error;
          resolve(null);
        });
    });
  }
}
