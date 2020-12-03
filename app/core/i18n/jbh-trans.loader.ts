import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export class JbhTransLoader {
  constructor(private readonly http: HttpClient) { }
  public getTranslation(lang: string, moduleName = 'common'): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}/${moduleName}.json`);
  }
}
