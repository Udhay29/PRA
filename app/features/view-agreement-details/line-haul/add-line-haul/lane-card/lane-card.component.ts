import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';

import { LaneCardModel } from './model//lane-card.model';
import { LaneCardService } from './services/lane-card.service';
import { LineHaulQuery } from './query/line-haul.query';
import { CreateLineHaulModel } from '../../create-line-haul/model/create-line-haul.model';
import { ListItemInterface, HitsInterface, GeographicPointType, AddressValuesInterface } from './model/lane-card.interface';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { EditLineHaulQuery } from './query/edit-linehaul.query';
import { LaneCardUtility } from './services/lane-card-utility';
@Component({
  selector: 'app-lane-card',
  templateUrl: './lane-card.component.html',
  styleUrls: ['./lane-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaneCardComponent implements OnInit, OnDestroy {
  cityState: string;
  zip3Range = '3-Zip Range';
  zip5Range = '5-Zip Range';
  zip6Range = '6-Zip Range';
  zip9Range = '9-Zip Range';
  zip3Region = '3-Zip Region';
  cityStateRegion = 'City State Region';
  @Input() expirationDate: CreateLineHaulModel;
  @Output() navigationEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() typeId: EventEmitter<object> = new EventEmitter<object>();
  laneCardModel: LaneCardModel;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly messageService: MessageService,
    private router: Router,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly shared: BroadcasterService,
    private laneCardService: LaneCardService) {
    this.laneCardModel = new LaneCardModel();
    this.addLineHaulForm();
    this.cityState = 'City State';
  }

  ngOnInit() {
    this.getOriginTypes();
    this.getCountries();
  }
  ngOnDestroy() {
    this.laneCardModel.subscribeFlag = false;
  }

  addLineHaulForm() {
    this.laneCardModel.laneCardForm = this.formBuilder.group({
      originType: ['', Validators.required],
      originCountry: ['', Validators.required],
      originPoint: ['', [Validators.required, this.checkInSuggestion()]],
      originPointFrom: [''],
      originPointTo: [''],
      originDescription: [''],
      originVendorId: [''],
      destinationType: ['', Validators.required],
      destinationCountry: ['', Validators.required],
      destinationPoint: ['', [Validators.required, this.checkInSuggestion()]],
      destinationPointFrom: [''],
      destinationPointTo: [''],
      destinationDescription: [''],
      destinationVendorId: ['']
    });
    this.laneCardModel.zipRangeForm = this.formBuilder.group({
      rangeFrom: [null, [Validators.required, this.checkInSuggestion()]],
      rangeTo: [null, [Validators.required, this.checkInSuggestion()]]
    });
  }
  checkInSuggestion(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { invalid: true };
      }
    };
  }
  onautoCompleteBlur(event: Event, controlName: string) {
    if (this.laneCardModel.laneCardForm.controls[controlName].value &&
      !event.target['value']) {
      this.laneCardModel.laneCardForm.controls[controlName].setValue(null);
    }
    if ((controlName === 'originPoint' || controlName === 'destinationPoint') &&
      !this.laneCardModel.laneCardForm.controls[controlName].value && event.target['value'] === '') {
      this.laneCardModel.laneCardForm.controls[controlName].setErrors({ required: true });
    }
    if (controlName === 'originPointFrom' || controlName === 'originPointTo') {
      this.checkValidRange(
        event, controlName, 'originPointFrom', 'originPointTo', 'isOriginRangeError'
      );
    } else if (controlName === 'destinationPointFrom' || controlName === 'destinationPointTo') {
      this.checkValidRange(
        event, controlName, 'destinationPointFrom', 'destinationPointTo', 'isDestinationRangeError'
      );
    }
  }
  getOriginTypes() {
    this.laneCardService.getGeographyTypes('Line Haul').pipe(takeWhile(() => this.laneCardModel.subscribeFlag))
      .subscribe((response: GeographicPointType[]) => {
        this.laneCardModel.geographyValues = [];
        response.forEach((geographyValues: GeographicPointType) => {
          this.laneCardModel.geographyValues.push({
            label: geographyValues['geographicPointTypeName'],
            value: geographyValues['geographicPointTypeID']
          });
        });
        this.laneCardModel.geographyValues = utils.sortBy(this.laneCardModel.geographyValues, ['label']);
        this.setvalueforLaneCard();
      });
  }
  onOriginPointSelected(event: Event, formControl?: string) {
    this.laneCardModel.originValues = event['dtoValues'];
  }
  checkValidRange(event: Event, controlName: string, controlFrom: string, controlTo: string, errorFlag: string) {
    this.laneCardModel[errorFlag] = false;
    if (
      this.laneCardModel.laneCardForm.controls[controlFrom].value && this.laneCardModel.laneCardForm.controls[controlTo].value
      && this.laneCardModel.laneCardForm.controls[controlFrom].valid
      && this.laneCardModel.laneCardForm.controls[controlTo].valid
    ) {
      const fromValue = this.laneCardModel.laneCardForm.controls[controlFrom].value.dtoValues.replace('-', '');
      const toValue = this.laneCardModel.laneCardForm.controls[controlTo].value.dtoValues.replace('-', '');
      this.laneCardModel.laneCardForm.controls[controlFrom].setErrors(null);
      if (Number(fromValue) >= Number(toValue)) {
        this.laneCardModel[errorFlag] = true;
      }
    } else if (utils.isEmpty(this.laneCardModel.laneCardForm.controls[controlName].value)) {
      this.laneCardModel.laneCardForm.controls[controlName].setErrors({ required: true });
    }
    this.changeDetector.detectChanges();
  }
  onDestinationPointSelected(event: Event) {
    this.laneCardModel.destinationValues = event['dtoValues'];
  }
  onTypeOriginType(event: Event) {
    this.laneCardModel.geographyValuesTyped = [];
    if (this.laneCardModel.geographyValues) {
      this.laneCardModel.geographyValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.laneCardModel.geographyValuesTyped.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  getCountries() {
    this.laneCardModel.isCountryDefault = false;
    this.laneCardService.getCountries().pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      if (data) {
        const dataValues = data['_embedded']['countryTypes'];
        this.laneCardModel.countries = dataValues.map(value => {
          return {
            label: value['countryName'],
            value: value['countryCode']
          };
        });
        this.laneCardModel.laneCardForm.controls['originCountry'].setValue({
          label: 'USA',
          value: 'USA'
        });
        this.laneCardModel.laneCardForm.controls['destinationCountry'].setValue({
          label: 'USA',
          value: 'USA'
        });
      }
      this.laneCardModel.countries = utils.sortBy(this.laneCardModel.countries, ['label']);
      this.laneCardModel.isCountryDefault = true;
      this.changeDetector.detectChanges();
    });
  }
  onTypeCountries(event: Event) {
    this.laneCardModel.countryFiltered = [];
    if (this.laneCardModel.geographyValues) {
      this.laneCardModel.countries.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.laneCardModel.countryFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  onOriginTypeSelected(event: Event, field: string, key: string): void {
    field === 'originPoint' ? this.laneCardModel.isOriginRangeError = false : this.laneCardModel.isDestinationRangeError = false;
    this.laneCardModel[key] = event['value'];
    if (this.laneCardModel.originID && this.laneCardModel.destinationID) {
      const obj = {
        originID: this.laneCardModel.originID,
        destinationID: this.laneCardModel.destinationID
      };
      this.typeId.emit(obj);
      this.changeDetector.detectChanges();
    }
    LaneCardUtility.resetMultipleField(this.laneCardModel, field);
    const type = event['label'];
    this.laneCardModel.laneCardForm['controls'][field].setValue(null);
    this.laneCardModel.laneCardForm['controls'][`${field}From`].setValue(null);
    this.laneCardModel.laneCardForm['controls'][`${field}To`].setValue(null);
    this.laneCardModel.laneCardForm['controls'][field].setErrors(null);
    switch (type) {
      case this.cityState:
        this.laneCardModel[field] = 'cityState';
        this.resetFlags(key);
        break;
      case 'Address':
      case 'State':
      case 'Yard':
      case 'Ramp':
      case 'Location':
      case '2-Zip':
      case '3-Zip':
      case '5-Zip':
      case '6-Zip':
      case '9-Zip':
        this.laneCardModel[field] = type.toLowerCase();
        this.resetFlags(key);
        break;
      case this.zip3Range:
      case this.zip5Range:
      case this.zip6Range:
      case this.zip9Range:
        this.laneCardModel[field] = type;
        if (field === 'originPoint') {
          this.laneCardModel.originPointFrom = type;
          this.laneCardModel.originPointTo = type;
        } else {
          this.laneCardModel.destinationPointFrom = type;
          this.laneCardModel.destinationPointTo = type;
        }
        this.setSelectionFlags(key);
        break;
      case this.zip3Region:
      case this.cityStateRegion:
        this.resetFlags(key);
        LaneCardUtility.setVariables(this.laneCardModel, field, type);
      break;
    }
  }
  setSelectionFlags(key: string) {
    if (key === 'destinationID') {
      this.laneCardModel.isDestinationRangeSelected = true;
      this.laneCardModel.laneCardForm.controls['destinationPointFrom'].setValue(null);
      this.laneCardModel.laneCardForm.controls['destinationPointTo'].setValue(null);
      this.laneCardModel.laneCardForm.controls['destinationPointFrom'].setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls['destinationPointFrom'].updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['destinationPointFrom'].markAsUntouched();
      this.laneCardModel.laneCardForm.controls['destinationPointTo'].setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls['destinationPointTo'].updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['destinationPointTo'].markAsUntouched();
      this.laneCardModel.laneCardForm.controls['destinationPoint'].setValidators([]);
      this.laneCardModel.laneCardForm.controls['destinationPoint'].updateValueAndValidity();
    } else {
      this.laneCardModel.isOriginRangeSelected = true;
      this.laneCardModel.laneCardForm.controls['originPointFrom'].setValue(null);
      this.laneCardModel.laneCardForm.controls['originPointTo'].setValue(null);
      this.laneCardModel.laneCardForm.controls['originPointFrom'].setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls['originPointFrom'].updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['originPointFrom'].markAsUntouched();
      this.laneCardModel.laneCardForm.controls['originPointTo'].setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls['originPointTo'].updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['originPointTo'].markAsUntouched();
      this.laneCardModel.laneCardForm.controls['originPoint'].setValidators([]);
      this.laneCardModel.laneCardForm.controls['originPoint'].updateValueAndValidity();
    }
  }
  resetFlags(key: string) {
    if (key === 'destinationID') {
      this.laneCardModel.isDestinationRangeSelected = false;
      this.laneCardModel.laneCardForm.controls.destinationPointFrom.setValidators([]);
      this.laneCardModel.laneCardForm.controls.destinationPointFrom.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls.destinationPointTo.setValidators([]);
      this.laneCardModel.laneCardForm.controls.destinationPointTo.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls.destinationPoint.setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls.destinationPoint.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['destinationPoint'].markAsUntouched();
    } else {
      this.laneCardModel.isOriginRangeSelected = false;
      this.laneCardModel.laneCardForm.controls.originPointFrom.setValidators([]);
      this.laneCardModel.laneCardForm.controls.originPointTo.setValidators([]);
      this.laneCardModel.laneCardForm.controls.originPointFrom.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls.originPointTo.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls.originPoint.setValidators([Validators.required]);
      this.laneCardModel.laneCardForm.controls.originPoint.updateValueAndValidity();
      this.laneCardModel.laneCardForm.controls['originPoint'].markAsUntouched();
    }
  }
  onCountrySelected(field: string, rangeFlag: string, fieldFrom: string, fieldTo: string) {
    field === 'originPoint' ? this.laneCardModel.isOriginRangeError = false : this.laneCardModel.isDestinationRangeError = false;
    if (this.laneCardModel[rangeFlag] && (this.laneCardModel.laneCardForm['controls'][fieldFrom]['value'] ||
      this.laneCardModel.laneCardForm['controls'][fieldTo]['value'])) {
      this.laneCardModel.laneCardForm['controls'][fieldFrom].setValue(null);
      this.laneCardModel.laneCardForm['controls'][fieldTo].setValue(null);
    }
    if (!utils.isEmpty(this.laneCardModel.laneCardForm['controls'][field]['value'])) {
      const modelLabel = (field === 'originPoint') ? 'isShowMultipleFieldOrigin' : 'isShowMultipleFieldDestination';
      const value = (this.laneCardModel[modelLabel]) ? [] : null;
      this.laneCardModel.laneCardForm['controls'][field].setValue(value);
    }
  }
  onTypeOriginDestPoint(event: string, type: string, fieldName: string, originType: string): void {
    if (this.laneCardModel.laneCardForm['controls'][type]['value'] &&
      this.laneCardModel.laneCardForm['controls'][fieldName]['value']) {
      switch (this.laneCardModel[originType]) {
        case 'address':
          this.getAddressData(event, fieldName, type, originType);
          break;
        case 'cityState':
        case this.cityStateRegion:
          this.getCityState(event, fieldName, 'cityState', type, originType);
          break;
        case 'state':
          this.getCityState(event, fieldName, 'state', type, originType);
          break;
        case 'yard':
          this.getRampYard(event, fieldName, 'yard', type, originType);
          break;
        case 'ramp':
          this.getRampYard(event, fieldName, 'ramp', type, originType);
          break;
        case 'location':
          this.getLocation(event, fieldName, 'location', type, originType);
          break;
        case '2-zip':
          this.getPostalCode(event, fieldName, '2', type, originType);
          break;
        case '3-zip':
          this.getPostalCode(event, fieldName, '3', type, originType);
          break;
        case '5-zip':
          this.getPostalCode(event, fieldName, '5', type, originType);
          break;
        case '6-zip':
          this.getPostalCode(event, fieldName, '6', type, originType);
          break;
        case '9-zip':
          this.getPostalCode(event, fieldName, '9', type, originType);
          break;
        case this.zip3Range:
          this.getPostalCode(event, fieldName, '3', type, originType);
          break;
        case this.zip5Range:
          this.getPostalCode(event, fieldName, '5', type, originType);
          break;
        case this.zip6Range:
          this.getPostalCode(event, fieldName, '6', type, originType);
          break;
        case this.zip9Range:
          this.getPostalCode(event, fieldName, '9', type, originType);
          break;
        case this.zip3Region:
          this.getPostalCode(event, fieldName, '3', type, originType);
          break;
      }
    } else {
      this.laneCardModel.laneCardForm.controls[type].markAsTouched();
      this.laneCardModel.laneCardForm.controls[fieldName].markAsTouched();
      this.laneCardModel.responseData = [];
    }

  }
  getAddressData(event: string, fieldName: string, type: string, controlName: string) {
    this.laneCardModel[fieldName] = false;
    const query = LineHaulQuery.getOriginDestinationQuery(event, this.laneCardModel.laneCardForm['controls'][fieldName]['value']['value']);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      this.laneCardModel.responseData = this.addressFramer(data);
      if (utils.isEmpty(this.laneCardModel.responseData)) {
        this.laneCardModel[type] = true;
      }
      this.setFormErrors(controlName);
      this.changeDetector.detectChanges();
    });
  }
  getCityState(event: string, fieldName: string, type: string, pointType: string, controlName: string) {
    this.laneCardModel[fieldName] = false;
    const query = this.queryGetter(event, type, this.laneCardModel.laneCardForm['controls'][fieldName]['value']['value']);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      this.laneCardModel.responseData = this.originTypeFamer(data, type);
      if (utils.isEmpty(this.laneCardModel.responseData)) {
        this.laneCardModel[pointType] = true;
      }
      this.setFormErrors(controlName);
      this.changeDetector.detectChanges();
    });
  }
  getRampYard(event: string, fieldName: string, type: string, pointType: string, controlName: string) {
    this.laneCardModel[fieldName] = false;
    const query = LineHaulQuery.getRampYardQuery(event, this.laneCardModel.laneCardForm['controls'][pointType]['value']['label'],
      this.laneCardModel.laneCardForm['controls'][fieldName]['value']['value']);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      this.laneCardModel.responseData = this.locationFramer(data);
      if (utils.isEmpty(this.laneCardModel.responseData)) {
        this.laneCardModel[pointType] = true;
      }
      this.setFormErrors(controlName);
      this.changeDetector.detectChanges();
    });
  }
  getLocation(event: string, fieldName: string, type: string, pointType: string, controlName: string) {
    this.laneCardModel[fieldName] = false;
    const query = LineHaulQuery.getRampYardQuery(event, '',
      this.laneCardModel.laneCardForm['controls'][fieldName]['value']['value']);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      this.laneCardModel.responseData = this.locationFramer(data);
      if (utils.isEmpty(this.laneCardModel.responseData)) {
        this.laneCardModel[pointType] = true;
      }
      this.setFormErrors(controlName);
      this.changeDetector.detectChanges();
    });
  }
  getPostalCode(event: string, fieldName: string, type: string, pointType: string, controlName: string) {
    this.laneCardModel[fieldName] = false;
    if (pointType === 'originType') {
      this.laneCardModel['isRangeError'] = false;
      this.laneCardModel['isoriginPointRangeError'] = false;
    }
    if (pointType === 'destinationType') {
      this.laneCardModel['isRangeError'] = false;
      this.laneCardModel['isdestinationPointRangeError'] = false;
    }
    const query = LineHaulQuery.getPostalZipQuery(event, parseInt(type, 10),
      this.laneCardModel.laneCardForm['controls'][fieldName]['value']['value']);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe(data => {
      this.laneCardModel.responseData = this.postalcodeFramer(data);
      if (utils.isEmpty(this.laneCardModel.responseData)) {
        if (pointType === 'originType' && (controlName === 'originPointFrom' || controlName === 'originPointTo')) {
          this.laneCardModel['isoriginPointRangeError'] = true;
        } else if (pointType === 'destinationType' && (controlName === 'destinationPointFrom' || controlName === 'destinationPointTo')) {
          this.laneCardModel['isdestinationPointRangeError'] = true;
        } else if (controlName === 'rangeFrom' || controlName === 'rangeTo') {
          this.laneCardModel['isRangeError'] = true;
        } else {
          this.laneCardModel[pointType] = true;
        }
      }
      this.setFormErrors(controlName);
      this.changeDetector.detectChanges();
    });
  }
  originTypeFamer(data: HitsInterface[], type: string) {
    let dataValues = [];
    if (type === 'cityState') {
      dataValues = this.cityStateFramer(data);
    } else if (type === this.cityStateRegion) {
      dataValues = this.frameCityStateRegion(data);
    } else {
      dataValues = this.stateFramer(data);
    }
    return dataValues;
  }
  queryGetter(event: string, type: string, country: string): object {
    let query = {};
    if (type === 'cityState') {
      query = LineHaulQuery.getCityQuery(event, country);
    } else if (type === this.cityStateRegion) {
      query = LineHaulQuery.getCityStateRegionQuery(event, country);
    } else {
      query = LineHaulQuery.getStateQuery(event, country);
    }
    return query;
  }
  postalcodeFramer(data: HitsInterface[]): AddressValuesInterface[] {
    let dataList = [];
    if (data && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const location = value['_source'];
        return {
          label: this.postalCodeSplice(location),
          value: location['PostalCodeID'],
          dtoValues: location['PostalCode'],
          countryCode: location['CountryCode']
        };
      });
    }
    return utils.uniqBy(dataList, 'value');
  }
  locationFramer(data: HitsInterface[]): AddressValuesInterface[] {
    let dataList = [];
    if (data && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const list = value['_source']['Address'];
        const address2 = list['AddressLine2'] ? `${list['AddressLine2']}${', '}` : '';
        const location = `${value['_source']['LocationName']}(${value['_source']['LocationCode']}), ${
          list['AddressLine1']}${', '}${address2}${list['CityName']}${', '}${
          list['StateCode']}${' '}${list['PostalCode']}${', '}${list['CountryCode']}`;
        return {
          label: location,
          value: value['_source']['LocationID'],
          dtoValues: this.AddressDtoFromer(list)
        };
      });
    }
    return dataList;
  }
  addressFramer(data: HitsInterface[]): AddressValuesInterface[] {
    let listVal = [];
    if (data) {
      const dataValues = data['hits']['hits'];
      listVal = dataValues.map(value => {
        const list = value['_source']['Address'];
        const address2 = list['AddressLine2'] ? `${list['AddressLine2']}${', '}` : '';
          return {
          label: `${list['AddressLine1']}${', '}${address2}${list['CityName']}${', '}${
            list['StateCode']}${', '}${list['PostalCode']}${', '}${list['CountryCode']}`,
          value: list['AddressID'],
          dtoValues: this.AddressDtoFromer(list)
        };
      });
      listVal = utils.uniqBy(listVal, 'value');
    }
    return listVal;
  }
  AddressDtoFromer(list: object) {
    const obj = {};
    obj['addressLine1'] = list['AddressLine1'];
    obj['addressLine2'] = list['AddressLine2'];
    obj['cityName'] = list['CityName'];
    obj['countryCode'] = list['CountryCode'];
    obj['countryName'] = list['CountryName'];
    obj['postalCode'] = list['PostalCode'];
    obj['stateCode'] = list['StateCode'];
    obj['stateName'] = list['StateName'];
    return obj;
  }
  cityDtoFromer(list: object, type: string) {
    const obj = {};
    obj['cityName'] = type === 'city' ? list['CityName'] : null;
    obj['countryCode'] = list['Country']['CountryCode'];
    obj['countryName'] = list['Country']['CountryName'];
    obj['stateCode'] = list['State']['StateCode'];
    obj['stateName'] = list['State']['StateName'];
    return obj;
  }
  cityStateFramer(data: HitsInterface[]): AddressValuesInterface[] {
    let dataList = [];
    if (data && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const source = value['inner_hits']['City']['hits']['hits'][0]['_source'];
        return {
          label: `${source['CityName']}${', '}${source['State']['StateCode']}`,
          value: source['CityID'],
          dtoValues: this.cityDtoFromer(source, 'city')
        };
      });
    }
    dataList = utils.uniqBy(dataList, 'value');
    return dataList;
  }
  frameCityStateRegion(hitsData) {
    let dataList = [];
    utils.forEach(hitsData, (data) => {
      if (data && data.inner_hits && data.inner_hits.City && data.inner_hits.City.hits && data.inner_hits.City.hits.hits &&
         data.inner_hits.City.hits.hits.length) {
           const value = data.inner_hits.City.hits.hits;
           dataList.push( {
            label: `${value[0]._source.CityName}${', '}${value[0]._source.State.StateCode}`,
            value: value[0]._source.CityID,
            dtoValues: this.cityDtoFromer(value[0]._source, 'city')
          });
      }
    });
    dataList = utils.sortBy(utils.uniqBy(dataList, 'value'), ['label']);
    return dataList;
  }
  stateFramer(data: HitsInterface[]): AddressValuesInterface[] {
    let dataList = [];
    if (data && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const source = value['inner_hits']['City']['hits']['hits'][0]['_source'];
        return {
          label: source['State']['StateName'],
          value: source['State']['StateID'],
          dtoValues: this.cityDtoFromer(source, 'state')
        };
      });
    }
    dataList = utils.uniqBy(dataList, 'value');
    return dataList;
  }
  setFormErrors(controlName: string) {
    if (controlName === 'rangeFrom' || controlName === 'rangeTo') {
      this.laneCardModel.zipRangeForm.controls[controlName].setErrors(this.laneCardModel.isRangeError ? { invalid: true } : null);
    } else {
      const errorFlag = (this.laneCardModel.originPoint || this.laneCardModel.destinationPoint ||
        (this.laneCardModel.isoriginPointRangeError && (controlName === 'originPointFrom' || controlName === 'originPointTo')) ||
        (this.laneCardModel.isdestinationPointRangeError &&
          (controlName === 'destinationPointFrom' || controlName === 'destinationPointTo')));
      this.laneCardModel.laneCardForm.controls[controlName].setErrors(errorFlag ? { invalid: true } : null);
    }
  }

  setvalueforLaneCard() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.shared.on<LineHaulValues>('editlinehaulDetails').pipe(takeWhile(() => this.laneCardModel.subscribeFlag))
      .subscribe((editLineHaulData: LineHaulValues) => {
        if (!utils.isEmpty(editLineHaulData)) {
          this.laneCardModel.editLineHaulData = editLineHaulData;
          this.laneCardModel.laneCardForm.patchValue({
            originDescription: editLineHaulData['originDescription'],
            originVendorId: editLineHaulData['originVendorID'],
            destinationDescription: editLineHaulData['destinationDescription'],
            destinationVendorId: editLineHaulData['destinationVendorID'],
            originType: this.getselectedOriginType(editLineHaulData['originType']),
            destinationType: this.getselectedOriginType(editLineHaulData['destinationType']),
          });
          this.laneCardModel.originID = editLineHaulData['originTypeID'];
          this.laneCardModel.destinationID = editLineHaulData['destinationTypeID'];
          this.getEditOriginandDestinationType(editLineHaulData['originType'], 'originPoint', 'originId');
          this.getEditOriginandDestinationType(editLineHaulData['destinationType'], 'destinationPoint', 'destinationID');
          this.processedLaneDetails(editLineHaulData, 'originPoints', 'originType');
          this.processedLaneDetails(editLineHaulData, 'destinationPoints', 'destinationType');
          this.laneCardModel.laneCardForm.updateValueAndValidity();
        }
      });
    }
    this.changeDetector.detectChanges();
  }

  onAutoCompleteClear(value: string, controlName: string, isPopup = false) {
    const formName = (isPopup) ? 'zipRangeForm' : 'laneCardForm';
    if (utils.isEmpty(value) && utils.isEmpty(this.laneCardModel[formName].controls[controlName].value)) {
      const formValue = utils.isArray(this.laneCardModel[formName].controls[controlName].value) ? [] : value;
      this.laneCardModel[formName].controls[controlName].setValue(formValue);
      this.laneCardModel[formName].controls[controlName].setErrors({required: true});
    }
    if (!utils.isEmpty(this.laneCardModel[formName].controls[controlName].value)) {
      this.laneCardModel[formName].controls[controlName].setErrors(null);
    }
    this.laneCardModel[formName].updateValueAndValidity();
  }

  getselectedOriginType(originType) {
    return utils.find(this.laneCardModel.geographyValues,
      { 'label': originType });
  }

  processedLaneDetails(lanedetails: LineHaulValues, selectedtype: string, typekey: string) {
    if (lanedetails && !utils.isEmpty(lanedetails[selectedtype])) {
      switch (lanedetails[typekey]) {
        case this.cityState:
          this.getEditData('cityState', lanedetails, selectedtype);
          break;
        case 'Address':
          this.getEditData('Address', lanedetails, selectedtype);
          break;
        case 'State':
          this.getEditData('state', lanedetails, selectedtype);
          break;
        case '2-Zip':
        case '5-Zip':
        case '3-Zip':
        case '9-Zip':
        case '6-Zip':
          this.getEditData('Zip', lanedetails, selectedtype);
          break;
        case this.zip3Range:
        case this.zip5Range:
        case this.zip6Range:
        case this.zip9Range:
          this.getEditData('ZipRange', lanedetails, selectedtype);
          break;
        case 'Yard':
        case 'Ramp':
        case 'Location':
          this.getEditData('YardRampLoc', lanedetails, selectedtype);
          break;
        case this.zip3Region:
          this.getEditRegionData('zipRegion', lanedetails, selectedtype);
          break;
        case this.cityStateRegion:
          this.getEditCityStateRegion(this.cityStateRegion, lanedetails, selectedtype);
          break;
        default:
          break;
      }
    }
  }
  getEditRegionData(processedlane: string, lanedetails: LineHaulValues, element: string) {
    const query = EditLineHaulQuery.getEditQuery(processedlane, lanedetails[element]);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe((data: HitsInterface[]) => {
      if (!utils.isEmpty(data) && !utils.isEmpty(data['hits']) && !utils.isEmpty(data['hits']['hits'])) {
        const postalCodeList = [];
        utils.forEach(data['hits']['hits'], (hit) => {
          postalCodeList.push(hit._source);
        });
        LaneCardUtility.frameZipRegion(postalCodeList, element, this.laneCardModel);
        this.changeDetector.detectChanges();
      }
    });
  }
  getEditData(processedlane: string, lanedetails: LineHaulValues, element: string) {
    const query = EditLineHaulQuery.getEditQuery(processedlane, lanedetails[element][0]);
    if (processedlane === 'Address' || processedlane === 'YardRampLoc') {
      this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag))
        .subscribe((data: HitsInterface[]) => {
          if (!utils.isEmpty(data)) {
            this.editData(data, processedlane, element);
          }
        });
    } else {
      this.laneCardService.getCityState(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag))
        .subscribe((data: HitsInterface[]) => {
          if (!utils.isEmpty(data)) {
            (processedlane === 'ZipRange') ? this.editZipRange(data, element) : this.editData(data, processedlane, element);
          }
        });
    }
  }
  getEditCityStateRegion(processedlane: string, lanedetails: LineHaulValues, element: string) {
    const query = EditLineHaulQuery.getEditQuery(processedlane, lanedetails[element]);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.laneCardModel.subscribeFlag)).subscribe((data: any) => {
      if (!utils.isEmpty(data) && !utils.isEmpty(data.hits) && !utils.isEmpty(data.hits.hits)) {
        this.editData(data.hits.hits, processedlane, element);
      }
    });

  }
  editData(data: HitsInterface[], processedlane: string, element: string) {
    let selectedValue = [];
    switch (processedlane) {
      case 'Address':
        selectedValue = this.addressFramer(data);
        break;
      case 'YardRampLoc':
        selectedValue = this.locationFramer(data);
        break;
      case 'Zip':
        selectedValue = this.postalcodeFramer(data);
        break;
      case 'cityState':
      case this.cityStateRegion:
      case 'state':
        selectedValue = this.originTypeFamer(data, processedlane);
        break;
      default:
        break;
    }
    (processedlane !== this.cityStateRegion) ? this.setOrginDestValues(selectedValue, element, processedlane) :
    this.setOrginDestValues(selectedValue, element, processedlane , true);
  }
  setOrginDestValues(selectedValue, element: string, processedlane: string, regionFlag = false) {
    if (regionFlag) {
      this.setRegionValues(selectedValue, element, processedlane);
    } else {
      this.setValues(selectedValue, element, processedlane);
    }
    this.changeDetector.detectChanges();
  }
  setRegionValues(selectedValue, element: string, processedlane: string) {
    const fieldName = (element === 'originPoints') ? 'originPoint' : 'destinationPoint';
    const countryField = (element === 'originPoints') ? 'originCountry' : 'destinationCountry';
    this.laneCardModel.laneCardForm.controls[fieldName].setValue(selectedValue);
    this.laneCardModel.laneCardForm.controls[countryField].setValue(LaneCardUtility.getCountry(fieldName, this.laneCardModel));
    this.laneCardModel.laneCardForm.updateValueAndValidity();
  }
  setValues(selectedValue, element: string, processedlane: string) {
    (element === 'originPoints') ? this.laneCardModel.laneCardForm.controls.originPoint.setValue(selectedValue[0]) :
      this.laneCardModel.laneCardForm.controls.destinationPoint.setValue(selectedValue[0]);
    (element === 'originPoints') ? this.laneCardModel.originValues = selectedValue[0]['dtoValues'] :
      this.laneCardModel.destinationValues = selectedValue[0]['dtoValues'];
    (processedlane === 'Zip') ? this.setCountryForEdit(selectedValue[0]['countryCode'], element) :
      this.setCountryForEdit(selectedValue[0]['dtoValues']['countryCode'], element);
  }
  editZipRange(data: HitsInterface[], element: string) {
    const selectedPostalEdit = this.postalcodeFramer(data);
    const lowerCode = selectedPostalEdit[0]['label'] > selectedPostalEdit[1]['label'] ? selectedPostalEdit[1] : selectedPostalEdit[0];
    const upperCode = selectedPostalEdit[0]['label'] > selectedPostalEdit[1]['label'] ? selectedPostalEdit[0] : selectedPostalEdit[1];
    if (element === 'originPoints') {
      this.setSelectionFlags('originID');
      this.laneCardModel.laneCardForm.controls.originPointFrom.setValue(lowerCode);
      this.laneCardModel.laneCardForm.controls.originPointTo.setValue(upperCode);
      this.laneCardModel.originValues = selectedPostalEdit[0]['dtoValues'];
    } else if (element === 'destinationPoints') {
      this.setSelectionFlags('destinationID');
      this.laneCardModel.laneCardForm.controls.destinationPointFrom.setValue(lowerCode);
      this.laneCardModel.laneCardForm.controls.destinationPointTo.setValue(upperCode);
      this.laneCardModel.destinationValues = selectedPostalEdit[0]['dtoValues'];
    }
    this.setCountryForEdit(selectedPostalEdit[0]['countryCode'], element);
    this.changeDetector.detectChanges();
  }
  getEditOriginandDestinationType(type: string, field: string, key: string) {
    LaneCardUtility.resetMultipleField(this.laneCardModel, field);
    this.laneCardModel.laneCardForm['controls'][field].setValue(null);
    this.laneCardModel.laneCardForm['controls'][field].setErrors(null);
    switch (type) {
      case this.cityState:
        this.laneCardModel[field] = 'cityState';
        break;
      case 'Address':
      case 'State':
      case 'Yard':
      case 'Ramp':
      case 'Location':
      case '2-Zip':
      case '5-Zip':
      case '3-Zip':
      case '6-Zip':
      case '9-Zip':
        this.laneCardModel[field] = type.toLowerCase();
        break;
      case this.zip3Range:
      case this.zip5Range:
      case this.zip6Range:
      case this.zip9Range:
        this.laneCardModel[field] = type;
        if (field === 'originPoint') {
          this.laneCardModel.originPointFrom = type;
          this.laneCardModel.originPointTo = type;
        } else {
          this.laneCardModel.destinationPointFrom = type;
          this.laneCardModel.destinationPointTo = type;
        }
        this.setSelectionFlags(key);
        break;
      case this.zip3Region:
      case this.cityStateRegion:
        this.resetFlags(key);
        LaneCardUtility.setVariables(this.laneCardModel, field, type);
        break;
      default: break;
    }
    this.changeDetector.detectChanges();
  }
  setCountryForEdit(countrycode: string, type: string) {
    const selectedCountry = utils.find(this.laneCardModel.countries,
      { 'value': countrycode });
    if (type === 'originPoints') {
      this.laneCardModel.laneCardForm.controls['originCountry'].setValue(selectedCountry);
    } else {
      this.laneCardModel.laneCardForm.controls['destinationCountry'].setValue(selectedCountry);
    }
  }
  postalCodeSplice(location: any) {
    if (location['PostalCode'].length === 9 && !location['PostalCode'].includes('-')) {
      return `${location['PostalCode'].substring(0, 5)}-${location['PostalCode'].substring(5, 9)}`;
    } else {
      return location['PostalCode'];
    }
  }
  addZipRange(pointType: string) {
    LaneCardUtility.onClickAddRange(this.laneCardModel, this.messageService, pointType);
    this.changeDetector.detectChanges();
  }
  onSearchZip(event: string, controlName: string) {
    const countryField = `${this.laneCardModel.selectedPoint}Country`;
    if (this.laneCardModel.laneCardForm['controls'][countryField]['value']) {
      this.getPostalCode(event, countryField, '3', `${this.laneCardModel.selectedPoint}Type`, controlName);
    }
  }
  autoCompleteBlur(event: Event, controlName: string) {
    LaneCardUtility.onFieldBlur(event, controlName, this.laneCardModel);
  }
  hidePopup() {
    this.laneCardModel.isShowAddRangePopup = false;
    this.laneCardModel.isRangeError = false;
    this.laneCardModel.zipRangeForm.reset();
  }
  addRangeValue() {
    if (this.laneCardModel.zipRangeForm.valid && !this.laneCardModel.isRangeError) {
      if (!utils.isUndefined(this.laneCardModel.zipRangeForm.get('rangeFrom').value.label) &&
      !utils.isUndefined(this.laneCardModel.zipRangeForm.get('rangeTo').value.label)) {
        const formFieldName = `${this.laneCardModel.selectedPoint}Point`;
        const formValues = (utils.isNull(this.laneCardModel.laneCardForm.value[formFieldName]) || utils
        .isEmpty(this.laneCardModel.laneCardForm.value[formFieldName])) ? [] : this.laneCardModel.laneCardForm.value[formFieldName];
        const newValue = `${this.laneCardModel.zipRangeForm.get('rangeFrom').value.label} - ${this
          .laneCardModel.zipRangeForm.get('rangeTo').value.label}`;
        formValues.push({label: newValue, value: {
          from: this.laneCardModel.zipRangeForm.get('rangeFrom').value,
          to: this.laneCardModel.zipRangeForm.get('rangeTo').value
        }, dtoValues: newValue, countryCode: this.laneCardModel.zipRangeForm.get('rangeFrom').value.countryCode});
        this.laneCardModel.laneCardForm.controls[formFieldName].setValue(formValues);
        this.hidePopup();
      } else {
        LaneCardUtility.checkInvalidField(this.laneCardModel, this.messageService);
      }
    } else  {
      utils.forIn(this.laneCardModel.zipRangeForm.controls, (value: FormControl, name: string) => {
        this.laneCardModel.zipRangeForm.controls[name].markAsTouched();
      });
      this.laneCardModel.zipRangeForm.updateValueAndValidity();
      LaneCardUtility.toastMessage('error', 'Missing Required Information',
      'Provide the required information in the highlighted fields and submit the form again',
      this.laneCardModel, this.messageService);
    }
  }
  onSelectValue(event, controlName: string, formName: string) {
    this.laneCardModel[formName].controls[controlName].setErrors(null);
    if (formName === 'zipRangeForm') {
      LaneCardUtility.checkDuplicateValue(event, controlName, formName, this.laneCardModel, this.messageService);
    }
  }
}
