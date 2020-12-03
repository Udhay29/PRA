import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { FormGroup, FormControl, FormArray, Validators, ValidatorFn, AbstractControl, Form } from '@angular/forms';
import * as utils from 'lodash';
import { StopsModel } from './models/stops.model';
import { ListItemInterface, GeographicPointType } from './models/stops.interface';
import { StopsService } from './services/stops.service';
import { LineHaulQuery } from '../lane-card/query/line-haul.query';
import { LaneCardService } from '../lane-card/services/lane-card.service';
import { HitsInterface } from '../lane-card/model/lane-card.interface';
import { MessageService } from 'primeng/components/common/messageservice';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';
import { EditStopQuery } from './query/edit-stops.query';


@Component({
  selector: 'app-stops',
  templateUrl: './stops.component.html',
  styleUrls: ['./stops.component.scss']
})

export class StopsComponent implements OnInit, OnDestroy {

  stopsModel: StopsModel;

  constructor(private readonly stopsService: StopsService,
    private readonly laneCardService: LaneCardService,
    private readonly messageService: MessageService,
    private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly shared: BroadcasterService,
    private readonly changeDetector: ChangeDetectorRef) {

    this.stopsModel = new StopsModel();
    this.createStopsForm();
  }

  ngOnInit() {
    this.getOriginTypes();
    this.getCountries();
    this.setvalueforStopSection();
  }

  ngOnDestroy() {
    this.stopsModel.subscribeFlag = false;
  }

  createStopsForm() {
    this.stopsModel.stopsForm = new FormGroup({
      isStopChargeIncluded: new FormControl(false),
      stops: new FormArray([])
    });
  }

  actionAddStop() {
    this.stopsModel.showAddStopBtn = false;
    (this.stopsModel.stopsForm.controls.stops as FormArray).push(this.createStopItem());
    this.stopsModel.stopsForm.get('isStopChargeIncluded').setValue(false);
  }

  getOriginTypes() {
    this.stopsService.getGeographyTypes('stop').pipe(takeWhile(() => this.stopsModel.subscribeFlag))
      .subscribe((response: GeographicPointType[]) => {
        this.stopsModel.geographyValues = [];
        response.forEach((geographyValues: GeographicPointType) => {
          this.stopsModel.geographyValues.push({
            label: geographyValues['geographicPointTypeName'],
            value: geographyValues['geographicPointTypeID']
          });
        });
        this.stopsModel.geographyValues = utils.sortBy(this.stopsModel.geographyValues, ['label']);
      });
  }
  onTypeOriginType(event: Event) {
    this.stopsModel.geographyValuesTyped = [];
    if (this.stopsModel.geographyValues) {
      this.stopsModel.geographyValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.stopsModel.geographyValuesTyped.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  getCountries(): void {
    this.laneCardService.getCountries().pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {
      if (data) {
        const dataValues = data['_embedded']['countryTypes'];
        this.stopsModel.countries = dataValues.map(value => {
          return {
            label: value['countryName'],
            value: {
              code: value['countryCode'],
              id: value['countryID']
            }
          };
        });
      }
      this.stopsModel.countries = utils.sortBy(this.stopsModel.countries, ['label']);
    });
  }
  onTypeCountries(event: Event) {
    this.stopsModel.countryFiltered = [];
    if (this.stopsModel.geographyValues) {
      this.stopsModel.countries.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.stopsModel.countryFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  invalidStops(stopsFormLength: number) {
    for (let i = 0; i < stopsFormLength; i++) {
      (this.stopsModel.stopsForm.controls.stops as FormArray).at(i).get('type').markAsTouched();
      (this.stopsModel.stopsForm.controls.stops as FormArray).at(i).get('point').markAsTouched();
      (this.stopsModel.stopsForm.controls.stops as FormArray).at(i).get('point').updateValueAndValidity();
    }
    this.changeDetector.detectChanges();
    this.messageService.clear();
    this.messageService.add({
      severity: 'error', summary: 'Missing Required Information',
      detail: 'Provide the required information in the highlighted fields'
    });
  }

  addStop(position: number): void {
    const stopsForm = (this.stopsModel.stopsForm.controls.stops as FormArray);
    const stopsFormLength = (this.stopsModel.stopsForm.controls.stops as FormArray).length;
    const typeFC = stopsForm.at(position).get('type');
    const pointFC = stopsForm.at(position).get('point');
    this.changeDetector.detectChanges();
    if (typeFC.value !== '' && typeof pointFC.value === 'object') {
      this.stopsInvalidCheck(stopsForm , stopsFormLength, position);
    } else {
      this.invalidStops(stopsFormLength);
    }
    if (this.stopsModel.isConsecutive) {
      for (let i = 0; i < this.stopsModel.stopsForm.controls.stops['controls'].length; i++) {
        if ((this.stopsModel.stopsForm.controls.stops['controls'][i + 2])
          && (this.stopsModel.stopsForm.controls.stops['controls'][i + 1].value.type === '' ||
            this.stopsModel.stopsForm.controls.stops['controls'][i + 1].value.point === '')
          && (this.stopsModel.stopsForm.controls.stops['controls'][i].value.type !== ''
            && (utils.isEqual(this.stopsModel.stopsForm.controls.stops['controls'][i].value,
              this.stopsModel.stopsForm.controls.stops['controls'][i + 2].value)))
        ) {
          this.stopsModel.stopsForm.controls.stops['controls'][i].controls.point.setErrors(null);
          this.stopsModel.stopsForm.controls.stops['controls'][i + 2].controls.point.setErrors(null);
          this.stopsModel.stopsForm.controls.stops['controls'][i].controls.point.markAsTouched();
          this.stopsModel.stopsForm.controls.stops['controls'][i + 2].controls.point.markAsTouched();
          this.changeDetector.detectChanges();
          this.stopsModel.invalidArray = utils.pull(this.stopsModel.invalidArray, i, i + 2);
        }
      }
    }
  }

  stopsInvalidCheck(stopsForm: FormArray , stopsFormLength: number, position: number) {
    if (stopsForm.invalid  && !this.stopsModel.isConsecutive) {
      this.invalidStops(stopsFormLength);
    } else {
      (this.stopsModel.stopsForm.controls.stops as FormArray).insert(position + 1, this.createStopItem());
    }
  }

  createStopItem(): FormGroup {
    return new FormGroup({
      type: new FormControl('', Validators.required),
      country: new FormControl({
        label: 'USA',
        value: {
          code: 'USA',
          id: 184
        }
      }, Validators.required),
      point: new FormControl('', [Validators.required, this.checkInSuggestion()]),
      vendorid: new FormControl('')
    });
  }

  checkInSuggestion(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value !== '' && typeof control.value === 'string') {
        return { invalid: true };
      }
    };
  }

  removeStop(position: number) {
    const stopsForm = (this.stopsModel.stopsForm.controls.stops as FormArray);
    stopsForm.removeAt(position);

    if (!stopsForm.length) {
      this.stopsModel.showAddStopBtn = true;
      this.stopsModel.stopsForm.get('isStopChargeIncluded').setValue(false);
    }
  }
  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  consecutiveValidation(position) {
    if (this.stopsModel.invalidArray && this.stopsModel.invalidArray.length) {
      for (let i = 0; i < this.stopsModel.invalidArray.length; i++) {
        if ((this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i] + 1]) &&
          !utils.isEqual(this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i]].value,
            this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i] + 1].value)) {
          this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i]].controls.point.setErrors(null);
          this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i] + 1].controls.point.setErrors(null);
          this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i]].controls.point.markAsTouched();
          this.stopsModel.stopsForm.controls.stops['controls'][this.stopsModel.invalidArray[i] + 1].controls.point.markAsTouched();
          this.changeDetector.detectChanges();
        }
        i++;
      }
    }
  }

  onStopPointChange(value: string, position: number) {
    this.stopsModel.isConsecutive = false;
    value = value.trim();
    this.consecutiveValidation(position);
    const type = (this.stopsModel.stopsForm.controls.stops as FormArray).at(position).get('type').value;

    if (!type) {
      (this.stopsModel.stopsForm.controls.stops as FormArray).at(position).get('type').markAsTouched();
      this.stopsModel.pointSuggestions = [];
      return;
    }
    this.getStopPointSuggestion(type, position, value);
  }
  getStopPointSuggestion(type: number, position: number, value: string): void {
    const country = (this.stopsModel.stopsForm.controls.stops as FormArray).at(position).get('country')['value']['value']['code'];
    const addressLabel = utils.find(this.stopsModel.geographyValues, utils.matchesProperty('value', type['value'])).label;

    switch (addressLabel) {
      case 'City State':
        this.getCityState(value, country, position);
        break;

      case 'Address':
        this.getAddressData(value, country, position);
        break;

      case 'State':
        this.getState(value, country, position);
        break;
      case 'Yard':
        this.getRampYard(value, addressLabel, country, position);
        break;
      case 'Ramp':
        this.getRampYard(value, addressLabel, country, position);
        break;
      case 'Location':
        this.getLocation(value, country, position);
        break;
      case '2-Zip':
        this.getPostalCode(value, 2, country, position);
        break;
      case '3-Zip':
        this.getPostalCode(value, 3, country, position);
        break;
      case '5-Zip':
        this.getPostalCode(value, 5, country, position);
        break;
      case '6-Zip':
        this.getPostalCode(value, 6, country, position);
        break;
      case '9-Zip':
        this.getPostalCode(value, 9, country, position);
        break;
    }
  }

  getCityState(value: string, country: string, position: number) {
    const query = LineHaulQuery.getCityQuery(value, country);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {

      this.stopsModel.pointSuggestions = this.originTypeFamer(data, 'cityState');
      this.changeDetector.detectChanges();
    });
  }
  getState(value: string, country: string, position: number) {
    const query = LineHaulQuery.getStateQuery(value, country);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {

      this.stopsModel.pointSuggestions = this.originTypeFamer(data, 'state');
      this.changeDetector.detectChanges();
    });
  }
  getRampYard(value: string, field: string, country: string, position: number) {
    const query = LineHaulQuery.getRampYardQuery(value, field, country);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {

      this.stopsModel.pointSuggestions = this.locationFramer(data);
      this.changeDetector.detectChanges();
    });
  }
  getLocation(value: string, country: string, position: number) {
    const query = LineHaulQuery.getRampYardQuery(value, '', country);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {

      this.stopsModel.pointSuggestions = this.locationFramer(data);
      this.changeDetector.detectChanges();
    });
  }
  getPostalCode(value: string, type: number, country: string, position: number) {
    const query = LineHaulQuery.getPostalZipQuery(value, type, country);
    this.laneCardService.getCityState(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {
      this.stopsModel.pointSuggestions = this.postalcodeFramer(data);
      this.changeDetector.detectChanges();
    }, (error: Error) => {
    });
  }
  locationFramer(data: HitsInterface[]): ListItemInterface[] {
    let dataList = null;
    if (!utils.isEmpty(data) && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const list = value['_source']['Address'];
        const address2 = list['AddressLine2'] ? `${list['AddressLine2']}${', '}` : '';
        const location = `${value['_source']['LocationName']}(${value['_source']['LocationCode']}), ${
          list['AddressLine1']}${', '}${address2}${list['CityName']}${', '}${
          list['StateCode']}${' '}${list['PostalCode']}${', '}${list['CountryCode']}`;
        return {
          label: location,
          value: value['_source']['LocationID'],
          countryCode: list['CountryCode'],
          rawData: list
        };
      });
    }
    return dataList;
  }

  postalcodeFramer(data: HitsInterface[]): ListItemInterface[] {
    let dataList = null;
    if (!utils.isEmpty(data) && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const location = value['_source']['PostalCode'];
        return {
          label: this.postalCodeSplice(location),
          value: value['_source']['PostalCodeID'],
          countryCode: value['_source']['CountryCode'],
          rawData: location
        };
      });
      dataList = utils.uniqBy(dataList, 'value');
    }
    return dataList;
  }
  originTypeFamer(data: HitsInterface[], type: string): ListItemInterface[] {
    let dataValues = [];
    if (type === 'cityState') {
      dataValues = this.cityStateFramer(data);
    } else {
      dataValues = this.stateFramer(data);
    }
    return dataValues;
  }

  cityStateFramer(data: HitsInterface[]): ListItemInterface[] {
    let dataList = null;
    if (!utils.isEmpty(data) && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const source = value['inner_hits']['City']['hits']['hits'][0]['_source'];
        return {
          label: `${source['CityName']}${', '}${source['State']['StateCode']}`,
          value: source['CityID'],
          countryCode: source['Country']['CountryCode'],
          rawData: source
        };
      });
      dataList = utils.uniqBy(dataList, 'value');
    }
    return dataList;
  }

  stateFramer(data: HitsInterface[]): ListItemInterface[] {
    let dataList = null;
    if (!utils.isEmpty(data) && data['hits']['hits']) {
      dataList = data['hits']['hits'].map(value => {
        const source = value['inner_hits']['City']['hits']['hits'][0]['_source'];
        return {
          label: source['State']['StateName'],
          value: source['State']['StateID'],
          countryCode: source['Country']['CountryCode'],
          rawData: source
        };
      });
      dataList = utils.uniqBy(dataList, 'value');
    }
    return dataList;
  }

  getAddressData(value: string, country: string, position: number) {
    const query = LineHaulQuery.getOriginDestinationQuery(value, country);
    this.laneCardService.getOriginPoint(query).pipe(takeWhile(() => this.stopsModel.subscribeFlag)).subscribe(data => {
      this.addressFramer(data, position);
    });
  }

  addressFramer(data: object, position: number) {
    if (data) {
      const dataValues = data['hits']['hits'];
      this.stopsModel.pointSuggestions = dataValues.map(value => {
        const list = value['_source']['Address'];
        const address2 = list['AddressLine2'] ? `${list['AddressLine2']}${', '}` : '';
        return {
          label: `${list['AddressLine1']}${', '}${address2}${list['CityName']}${', '}${
            list['StateCode']}${' '}${list['PostalCode']}${', '}${list['CountryCode']}`,
          value: list['AddressID'],
          rawData: list
        };
      });

      this.changeDetector.detectChanges();
    }
  }

  onCountryGeoChange(position: number) {
    const stopsForm = (this.stopsModel.stopsForm.controls.stops as FormArray);
    const typeFC = stopsForm.at(position).get('type');
    const pointFC = stopsForm.at(position).get('point');
    const country = stopsForm.at(position).get('country');
    pointFC.markAsUntouched();
    pointFC.setValue('');
    if (typeof pointFC.value === 'object') {
      pointFC.setValue('');
    }
    if (typeFC['value']['label'] === 'Country') {
      pointFC.setValue(country.value);
      pointFC.disable();
    } else {
      pointFC.enable();
    }
  }

  onautoCompleteBlur(event: Event, controlName: string, position: number) {
    const country = (this.stopsModel.stopsForm.controls.stops as FormArray).at(position).get(controlName).value;
    if (country && !event.target['value']) {
      (this.stopsModel.stopsForm.controls.stops as FormArray).at(position).get(controlName).setValue(null);
    }
  }

  editaddressPointFramer(data: object) {
    let dataList = null;
    if (!utils.isEmpty(data) && data['hits']['hits']) {
      const dataValues = data['hits']['hits'];
      dataList = dataValues.map(value => {
        const list = value['_source']['Address'];
        const address2 = list['AddressLine2'] ? `${list['AddressLine2']}${', '}` : '';
        return {
          label: `${list['AddressLine1']}${', '}${address2}${list['CityName']}${', '}${
          list['StateCode']}${' '}${list['PostalCode']}${', '}${list['CountryCode']}`,
          value: list['AddressID'],
          countryCode: list['CountryCode'],
          rawData: list
        };
      });
      this.changeDetector.detectChanges();
      dataList = utils.uniqBy(dataList, 'value');
    }
    return dataList;
  }

  getEditStopAddress(editLineHaulData: LineHaulValues) {
    const data = editLineHaulData.stops;
    utils.forEach(data, (stop) => {
      this.groupStopPointData(stop['typeName'], stop['pointID']);
    });
    this.getStopPointDetails(this.stopsModel.addressStopList, this.stopsModel.postalStopList,
      this.stopsModel.locationStopList, this.stopsModel.cityStateStopList, this.stopsModel.stateStopList,
      this.stopsModel.countryStopList, editLineHaulData);
  }




  setvalueforStopSection() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.shared.on<LineHaulValues>('editlinehaulDetails').pipe(takeWhile(() => this.stopsModel.subscribeFlag))
      .subscribe((editLineHaulData: LineHaulValues) => {
        if (!utils.isEmpty(editLineHaulData) && editLineHaulData['stops'].length > 0) {
          this.stopsModel.addressStopList = [];
          this.stopsModel.postalStopList = [];
          this.stopsModel.cityStateStopList = [];
          this.stopsModel.locationStopList = [];
          this.stopsModel.totalStopList = [];
          this.stopsModel.stateStopList = [];
          this.stopsModel.countryStopList = [];
          this.getEditStopAddress(editLineHaulData);
        }
      });
    }
  }

  setStopValues(selectedstop: any, editLineHaulData: LineHaulValues) {
    let typedata = null;
    if (editLineHaulData['stops'].length > 0) {
      this.stopsModel.showAddStopBtn = false;
    }
    const stopFormArray = (this.stopsModel.stopsForm.controls.stops as FormArray);
    this.clearStopsFormArray(stopFormArray);
    const formArrayStops = (this.stopsModel.stopsForm.controls.stops as FormArray);
    utils.each(editLineHaulData['stops'], (pointData) => {
      const details = utils.find(selectedstop, {
        'value': pointData['pointID']
      });
      const selectedCountry = this.setCountryforStop(details);
      typedata = {
        'label': pointData['typeName'],
        'value': pointData['customerLineHaulStopID']
      };
      if (pointData['typeName'] !== 'Country') {
        formArrayStops.push(this.editStopItem(typedata, selectedCountry, details, pointData['vendorID']));
      } else {
        formArrayStops.push(this.editStopItem(typedata, selectedCountry, selectedCountry, pointData['vendorID']));
      }
    });
    this.setCountryDisable();
    const stopIndicator = editLineHaulData.stopChargeIncludedIndicator === 'Yes';
    this.stopsModel.stopsForm.get('isStopChargeIncluded').
      setValue(stopIndicator);
    this.changeDetector.detectChanges();
  }

  setCountryforStop(stopdata) {
    let selectedCountry = null;
    utils.each(this.stopsModel.countries, (countrydata) => {
      if (countrydata['value']['code'] === stopdata.countryCode) {
        selectedCountry = countrydata;
      }
    });
    return selectedCountry;
  }

  groupStopPointData(type: string, pointId: number) {
    if (type === 'Address') {
      this.stopsModel.addressStopList.push(pointId);
    } else if (type === '2-Zip' || type === '3-Zip' || type === '5-Zip' || type === '6-Zip' || type === '9-Zip') {
      this.stopsModel.postalStopList.push(pointId);
    } else if (type === 'City State') {
      this.stopsModel.cityStateStopList.push(pointId);
    } else if (type === 'Location' || type === 'Yard' || type === 'Ramp') {
      this.stopsModel.locationStopList.push(pointId);
    } else if (type === 'State') {
      this.stopsModel.stateStopList.push(pointId);
    } else if (type === 'Country') {
      this.stopsModel.countryStopList.push(pointId);
    }
  }


  editStopItem(type: object, country: object, point: object, vendorid: string): FormGroup {
    return new FormGroup({
      type: new FormControl(type, Validators.required),
      country: new FormControl(country, Validators.required),
      vendorid: new FormControl(vendorid),
      point: new FormControl(point, [Validators.required, this.checkInSuggestion()])
    });
  }

  clearStopsFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  getStopPointDetails(addressList: any, postalList: any, locationList: any, cityStateList: any, stateList: any,
    countryList: any, editLineHaulData: LineHaulValues) {
    const addressQuery = this.frameQuery(addressList, 'Address');
    const postalQuery = this.frameQuery(postalList, 'Postalcode');
    const locationQuery = this.frameQuery(locationList, 'Location');
    const citystateQuery = this.frameQuery(cityStateList, 'CityState');
    const stateQuery = this.frameQuery(stateList, 'State');
    this.stopsService.getEditStopDetails(addressQuery, postalQuery, locationQuery, citystateQuery, stateQuery)
      .pipe(takeWhile(() => this.stopsModel.subscribeFlag))
      .subscribe((response: any) => {
        if (!utils.isEmpty(response)) {
          const selectedAddressList = this.editaddressPointFramer(response[0]);
          const selectedPostalList = this.postalcodeFramer(response[1]);
          const selectedLocationList = this.locationFramer(response[2]);
          const selectedPointCityState = this.originTypeFamer(response[3], 'cityState');
          const selectedPointState = this.originTypeFamer(response[4], 'State');
          this.frameStopFormData(selectedAddressList, selectedPostalList,
            selectedLocationList, selectedPointCityState, selectedPointState, countryList, editLineHaulData);
        }
      }, (error: Error) => {
      });
  }

  frameQuery(pointIds: any, type: string): any {
    let editQueryFrame = null;
    if (!utils.isEmpty(pointIds)) {
      switch (type) {
        case 'Address':
          editQueryFrame = EditStopQuery.getOriginDestinationQuery(pointIds);
          break;
        case 'Postalcode':
          editQueryFrame = EditStopQuery.getPostalZipQuery(pointIds);
          break;
        case 'CityState':
          editQueryFrame = EditStopQuery.getCityQuery(pointIds);
          break;
        case 'Location':
          editQueryFrame = EditStopQuery.getRampYardQuery(pointIds);
          break;
        case 'State':
          editQueryFrame = EditStopQuery.getStateQuery(pointIds);
          break;
        default:
          break;
      }
      return editQueryFrame;
    } else {
      return editQueryFrame;
    }
  }

  frameStopFormData(AddressList: any, postalList: any,
    locationList: any, cityList: any, stateList: any, countryList: any, editLineHaulData: LineHaulValues) {
    const editCountryList = [];
    this.stopsModel.totalStopList = [];
    if (!utils.isEmpty(AddressList)) {
      utils.each(AddressList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }
    if (!utils.isEmpty(postalList)) {
      utils.each(postalList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }

    if (!utils.isEmpty(locationList)) {
      utils.each(locationList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }

    if (!utils.isEmpty(cityList)) {
      utils.each(cityList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }

    if (!utils.isEmpty(stateList)) {
      utils.each(stateList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }

    if (!utils.isEmpty(countryList)) {
      utils.each(editLineHaulData.stops, (stopData) => {
        const countryObj = {
          label: stopData['country'],
          value: stopData['pointID'],
          countryCode: this.getCountryCode(stopData['pointID']),
        };
        editCountryList.push(countryObj);
      });
    }

    if (!utils.isEmpty(editCountryList)) {
      utils.each(editCountryList, (pointData) => {
        this.stopsModel.totalStopList.push(pointData);
      });
    }

    this.setStopValues(this.stopsModel.totalStopList, editLineHaulData);

  }

  getCountryCode(stopcountryId) {
    let selectedCountryCode = null;
    utils.each(this.stopsModel.countries, (countrydata) => {
      if (countrydata['value']['id'] === stopcountryId) {
        selectedCountryCode = countrydata['value']['code'];
      }
    });
    return selectedCountryCode;
  }

  postalCodeSplice(location: any) {
    if (location.length === 9) {
      return `${location.substring(0, 5)}-${location.substring(5, 9)}`;
    } else {
      return location;
    }
  }

  setCountryDisable() {
    const stopsFC = this.stopsModel.stopsForm.get('stops')['controls'];
    utils.each(stopsFC, (stop, index: number) => {
      const addressType = (this.stopsModel.stopsForm.get('stops') as FormArray).at(index).get('type').value;
      if (addressType['label'] === 'Country') {
        (this.stopsModel.stopsForm.get('stops') as FormArray).at(index).get('point').disable();
      }
    });
  }


}
