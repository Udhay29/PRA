import { Injectable } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { FilterData, SubmitStatus, EventQuery } from '../model/email-template-interface.interface';

@Injectable({
  providedIn: 'root'
})
export class TemplateUtilsService {

  constructor() { }

  filterDataElements(filterData: FilterData[], event: Event | EventQuery) {
    const filteredData = [];
    if (filterData) {
      filterData.forEach(dataElement => {
        if (dataElement.name && dataElement.name.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          filteredData.push({
            id: dataElement.id,
            name: dataElement.name,
            association: dataElement.association,
            code: dataElement['code'],
            label: dataElement['label']
          });
        }
      });
    }
    filteredData.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    return filteredData;
  }

  returnErrorMessage(submitStatus: SubmitStatus, controlName: string, form: FormGroup, type: string, saveControl: string): string {
    const message = 'Provide text';
    if (submitStatus.status) {
      if (submitStatus[controlName]) {
        return `Provide text before adding a new ${type}`;
      } else if (!submitStatus[saveControl]) {
        return message;
      }
      const control = form.get(controlName) as FormArray;
      return control.length === 1 ? message : `Provide text or remove ${type}`;
    } else {
      return !submitStatus[controlName] ? message : `Provide text before adding a new ${type}`;
    }
  }
}
