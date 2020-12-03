import { Component, ChangeDetectionStrategy, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { CarrierSectionModel } from './model/carrier-section.model';
import { CarrierDetails } from './create-carrier-section/model/create-carrier-section.interface';
@Component({
  selector: 'app-carrier-section',
  templateUrl: './carrier-section.component.html',
  styleUrls: ['./carrier-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarrierSectionComponent implements OnInit {
  carrierSectionModel: CarrierSectionModel;
  @Output() loaderEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set agreementDetails(agreementDetails: CarrierDetails) {
    this.carrierSectionModel.agreement = agreementDetails;
  }
  constructor() {
    this.carrierSectionModel = new CarrierSectionModel();
  }
  ngOnInit() {
  }
  /** function called when add section button is clicked
   * @memberof CarrierSectionComponent */
  onAddSection() {
    this.carrierSectionModel.isSplitView = true;
  }
  /** function called when split close event is emitted from split view
   * @param {boolean} event
   * @memberof CarrierSectionComponent */
  splitClose(event: boolean) {
    this.carrierSectionModel.isSplitView = event;
  }
  /** function to show or hide loader
   * @param {boolean} event
   * @memberof CarrierSectionComponent */
  loader(event: boolean) {
    this.loaderEvent.emit(event);
  }
}
