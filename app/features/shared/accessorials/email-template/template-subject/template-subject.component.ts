import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { TemplateUtilsService } from '../service/template-utils.service';
import * as utils from 'lodash';

@Component({
  selector: 'app-template-subject',
  templateUrl: './template-subject.component.html',
  styleUrls: ['./template-subject.component.scss']
})
export class TemplateSubjectComponent implements OnInit {

  @Input() subjectForm: FormGroup;
  @Input() dataElements;
  subjectElements: any;
  @Input() masterData;

  constructor(private readonly templateUtils: TemplateUtilsService) { }

  ngOnInit() {
  }

  filterSubjectData(event: Event) {
    this.subjectElements = this.templateUtils.filterDataElements(this.dataElements, event);
    if (this.masterData && this.masterData['subjectDataElements']) {
      this.subjectElements = utils.differenceBy(this.subjectElements, this.masterData['subjectDataElements'], 'id');
    }
    this.subjectElements = utils.differenceBy(this.subjectElements, this.subjectForm.controls.subjectDataElements.value, 'id');
  }

  checkRequiredStatus(controlName: string) {
    const control = this.subjectForm.get(controlName);
    return !(control['validator'] && control['validator']['length']);
  }

}
