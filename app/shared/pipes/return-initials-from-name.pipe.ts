import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'returnInitialsFromName'
})
export class ReturnInitialsFromNamePipe implements PipeTransform {

  transform(thisName: string, args?: any): string {
    if (thisName) {
      const thisNameInitials: Array<string> = thisName.match(/\b\w/g) || [];
      return ((thisNameInitials.shift() || '') + (thisNameInitials.pop() || '')).toUpperCase();
    } else {
      return '';
    }
  }

}
