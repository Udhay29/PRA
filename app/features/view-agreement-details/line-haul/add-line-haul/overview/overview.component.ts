import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/components/common/messageservice';

import { OverviewService } from './services/overview.service';
import { OverviewModel } from './model/overview.model';
import {
  BusinessUnit, SoBuAssociation
} from './../../../../create-agreement/add-cargo/models/add-cargo-interface';
import {
  ServiceLevel, ServiceLevelAssociation, EquipmentCategory, EquipmentType, EquipmentLength,
  ServiceOfferingList,
  OperationalService, AwardStatus, ServiceofferingInterface,
  ContractInterface
} from './model/overview.interface';
import { SaveResponseDto } from '../../create-line-haul/model/create-line-haul.interface';
import { LineHaulValues } from '../../additional-information/line-haul-overview/model/line-haul-overview.interface';
import { ViewAgreementDetailsUtility } from './../../../service/view-agreement-details-utility';
import { BroadcasterService } from '../../../../../shared/jbh-app-services/broadcaster.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() editSectionDate: any;
  @Input() sectionData: Array<SaveResponseDto>;
  @Input() set priorityData(value) {
    if (value) {
      this.getPriorityValues(value);
      this.changeDetector.detectChanges();
    }
  }
  @Output() sectionID: EventEmitter<ContractInterface> = new EventEmitter<ContractInterface>();

  overviewModel: OverviewModel;
  constructor(private readonly overviewService: OverviewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder, private readonly utilityService: ViewAgreementDetailsUtility,
    private readonly shared: BroadcasterService,
  ) {
    this.overviewModel = new OverviewModel();
  }

  ngOnInit() {
    this.overviewForm();
    this.getSectionData();
    this.getBusinessUnitList();
    this.getAwardStatus();
    this.getEquipmentCategory();
    this.setvalueforOverviewSection();
  }
  ngOnDestroy() {
    this.overviewModel.subscriberFlag = false;
  }
  overviewForm() {
    this.overviewModel.overviewForm = this.formBuilder.group({
      sectionValue: ['', Validators.required],
      businessUnit: ['', Validators.required],
      serviceOffering: ['', Validators.required],
      serviceLevel: [''],
      operationalServices: [''],
      equipmentCategory: ['', Validators.required],
      equipmentType: [''],
      equipmentLength: [''],
      awardStatus: ['', Validators.required],
      overriddenPriority: ['']
    });
  }
  onServiceOfferingBlurred(event) {
    if (utils.isEmpty(this.overviewModel.overviewForm.controls['businessUnit'].value)) {
      this.overviewModel.overviewForm.controls['businessUnit'].markAsTouched();
    } else {
      this.overviewModel.overviewForm.get('serviceOffering').setValidators([Validators.required]);
      this.overviewModel.overviewForm.get('serviceOffering').updateValueAndValidity();
    }
    if (utils.isEmpty(event.target.value)) {
      this.serviceOfferingClear();
    }
  }
  onautoCompleteBlur(event: Event, controlName: string) {
    if (this.overviewModel.overviewForm.controls[controlName].value &&
      !event.target['value']) {
      this.overviewModel.overviewForm.controls[controlName].setValue(null);
      if (controlName === 'sectionValue') {
        this.overviewModel.contractName = null;
      } else if (controlName === 'businessUnit') {
        this.overviewModel.overviewForm.controls['serviceOffering'].setValue(null);
        this.overviewModel.serviceOfferingData = [];
        this.overviewModel.serviceOfferingList = [];
        this.overviewModel.overviewForm.controls['serviceLevel'].setValue('');
        this.overviewModel.serviceLevelList = [];
        this.overviewModel.transitMode = null;
        this.overviewModel.overviewForm.controls['operationalServices'].setValue('');
        this.overviewModel.operationalServices = [];
      }
    }
    this.changeDetector.detectChanges();
  }
  getPriorityValues(data) {
    this.overviewService.getPriorityNumber(data).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((response) => {
        this.overviewModel.priorityLevelNumber = response;
        this.getOverRiddenPriorityValues();
        this.changeDetector.detectChanges();
      });
  }
  getServicelevelList() {
    const findBy = 'findByFinanceBusinessUnitServiceOfferingAssociationFinanceBusinessUnitCode';
    const financeCode = 'AndFinanceBusinessUnitServiceOfferingAssociationServiceOfferingCode';
    const serviceOffering = `&serviceOfferingCode=${this.overviewModel.selectedServiceOffering}`;
    const url = `/search/${findBy}${financeCode}?financeBusinessUnitCode=${this.overviewModel.selectedBu}${serviceOffering}`;
    if (!utils.isEmpty(this.overviewModel.overviewForm.controls['businessUnit'].value) &&
      !utils.isEmpty(this.overviewModel.overviewForm.controls['serviceOffering'].value)) {
      this.overviewService.getServiceLevel(url).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((response: ServiceLevel) => {
          if (response) {
            this.overviewModel.serviceLevelList = [];
            const businessUnits: Array<ServiceLevelAssociation> = response._embedded.serviceLevelBusinessUnitServiceOfferingAssociations;
            if (!utils.isEmpty(businessUnits)) {
              businessUnits.forEach((element: ServiceLevelAssociation) => {
                this.overviewModel.serviceLevelList.push({
                  label: element.serviceLevel.serviceLevelCode,
                  value: element.serviceLevel.serviceLevelDescription,
                  id: Number(element._links.serviceLevelBusinessUnitServiceOfferingAssociation.href.split('/').pop().split('{')[0])
                });
              });
            }
          }
          this.changeDetector.markForCheck();
        }, (serviceLevelError: HttpErrorResponse) => {
          this.setError(serviceLevelError);
        });
    } else {
      this.overviewModel.serviceLevelList = [];
    }
  }
  onTypeServiceLevel(event: Event) {
    this.overviewModel.serviceLevelData = [];
    if (this.overviewModel.serviceLevelList) {
      this.overviewModel.serviceLevelList.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.serviceLevelData.push({
            label: element.label,
            value: element.value,
            id: element.id
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  serviceLevelSelected(selectedServiceLevel: string) {
    this.overviewModel.serviceLevelList.forEach(element => {
      if (selectedServiceLevel === element['value']) {
        this.overviewModel.serviceLevelID = Number(element.id);
      }
    });
  }
  onserviceLevelBlurred(filedName: string) {
    if (utils.isEmpty(this.overviewModel.overviewForm.controls['businessUnit'].value) ||
      utils.isEmpty(this.overviewModel.overviewForm.controls['serviceOffering'].value)) {
      const controls = ['businessUnit', 'serviceOffering'];
      controls.forEach(element => {
        this.overviewModel.overviewForm.get(element).markAsTouched();
        this.overviewModel.overviewForm.get(element).setValidators([Validators.required]);
        this.overviewModel.overviewForm.get(element).updateValueAndValidity();
      });
    } else {
      if (filedName !== 'operationalServices' && filedName !== 'serviceLevel') {
        this.overviewModel.overviewForm.get(filedName).setValidators([Validators.required]);
        this.overviewModel.overviewForm.get(filedName).updateValueAndValidity();
      }
    }
  }
  getEquipmentCategory() {
    this.overviewService.getEquipmentCategory().pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((response: EquipmentCategory) => {
        if (response && response._embedded && response._embedded.equipmentClassifications) {
          this.overviewModel.equipmentCategory = [];
          for (const equipCat of response._embedded.equipmentClassifications) {
            this.overviewModel.equipmentCategory.push({
              label: equipCat.equipmentClassificationDescription.trim(),
              value: equipCat.equipmentClassificationCode.trim()
            });
          }
        }
        this.changeDetector.detectChanges();
      }, (equipmentCategoryError: HttpErrorResponse) => {
        this.setError(equipmentCategoryError);
      });
  }
  onTypeEquipmentCategory(event: Event) {
    this.overviewModel.equipmentCategoryList = [];
    if (this.overviewModel.equipmentCategory) {
      this.overviewModel.equipmentCategory.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.equipmentCategoryList.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  equipmentCategorySelected(selectedCategory: string) {
    this.overviewModel.selectedCategory = selectedCategory;
    const controls = ['equipmentType', 'equipmentLength'];
    controls.forEach(element => {
      this.overviewModel.overviewForm.controls[element].setValue(null);
      this.overviewModel.overviewForm.get(element).setValidators([]);
      this.overviewModel.overviewForm.get(element).updateValueAndValidity();
      this.overviewModel.equipmentTypeCode = '';
      this.overviewModel.equipmentLengthQuantity = null;
      this.overviewModel.equipmentLength = [];
      this.overviewModel.unitOfEquipmentLengthMeasurementCode = '';
      this.overviewModel.equipmentRequirementSpecificationAssociationID = null;
    });

    this.getEquipmentType();
  }

  onEquipmentBlur(event: Event, controlName: string) {
    if (this.overviewModel.overviewForm.controls[controlName].value &&
      !event.target['value']) {
      if (controlName === 'equipmentCategory') {
        this.equipmentCategoryClear();
      } else {
        this.overviewModel.equipmentTypeCode = this.overviewModel.overviewForm['equipmentType'];
        this.overviewModel.equipmentLength = [];
        this.overviewModel.overviewForm.controls.equipmentLength.reset();
        this.overviewModel.equipmentLengthQuantity = null;
        this.overviewModel.unitOfEquipmentLengthMeasurementCode = '';
        this.overviewModel.equipmentRequirementSpecificationAssociationID = null;
      }
    }
  }

  getEquipmentType() {
    const selectedCategory = this.overviewModel.selectedCategory;
    const url =
      `?equipmentClassificationCode=${selectedCategory}`;
    if (!utils.isEmpty(this.overviewModel.overviewForm.controls['equipmentCategory'].value)) {
      this.overviewService.getEquipmentType(url).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((response: EquipmentType) => {
          if (response && response._embedded && response._embedded.equipmentTypes) {
            this.overviewModel.equipmentType = [];
            for (const equipType of response._embedded.equipmentTypes) {
              this.overviewModel.equipmentType.push({
                label: equipType.equipmentTypeDescription.trim(),
                value: equipType.equipmentTypeCode.trim()
              });
            }
          }
          this.changeDetector.detectChanges();
        }, (equipmentTypeError: HttpErrorResponse) => {
          this.setError(equipmentTypeError);
        });
    } else {
      this.overviewModel.equipmentType = [];
    }
  }
  onTypeEquipmentType(event: Event) {
    this.overviewModel.equipmentTypeList = [];
    if (this.overviewModel.equipmentType) {
      this.overviewModel.equipmentType.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.equipmentTypeList.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  equipmentTypeSelected(equipmentTypes: string) {
    this.overviewModel.equipmentType.forEach(element => {
      if (equipmentTypes === element['value']) {
        this.overviewModel.equipmentTypeCode = element.value;
      }
      this.overviewModel.overviewForm.controls['equipmentLength'].setValue('');
      this.overviewModel.equipmentLength = [];
      this.overviewModel.equipmentLengthQuantity = null;
      this.overviewModel.unitOfEquipmentLengthMeasurementCode = '';
      this.overviewModel.equipmentRequirementSpecificationAssociationID = null;
    });
    this.overviewModel.isEquipmentTypeRequired = false;
    this.getEquipmentLength();
  }
  equipmentFieldblurred() {
    if (utils.isEmpty(this.overviewModel.overviewForm.controls['equipmentCategory'].value)) {
      this.overviewModel.overviewForm.controls['equipmentCategory'].markAsTouched();
    }
  }
  getEquipmentLength() {
    const selectedCategory = this.overviewModel.selectedCategory;
    const equipmentTypeCode = this.overviewModel.equipmentTypeCode;
    const url = `?equipmentClassificationCode=${selectedCategory}&equipmentTypeCode=${equipmentTypeCode}&sort=lengthQuantity`;
    if (this.overviewModel.equipmentTypeCode) {
      this.overviewService.getEquipmentLength(url).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((response: EquipmentLength) => {
          if (response && response._embedded && response._embedded.equipmentDimensions) {
            this.equipmentLengthResponse(response);
          }
          this.overviewModel.equipmentLength = utils.uniqBy(this.overviewModel.equipmentLength, 'label');
          this.changeDetector.detectChanges();
        }, (equipmentLengthError: HttpErrorResponse) => {
          this.setError(equipmentLengthError);
        });
    } else {
      this.overviewModel.equipmentLength = [];
      this.overviewModel.overviewForm.controls['equipmentType'].markAsTouched();
      this.overviewModel.overviewForm.get('equipmentType').setValidators([Validators.required]);
      this.overviewModel.overviewForm.get('equipmentType').updateValueAndValidity();
      this.overviewModel.isEquipmentTypeRequired = true;
    }
  }
  equipmentLengthResponse(response: EquipmentLength) {
    this.overviewModel.equipmentLength = [];
    for (const equipLength of response._embedded.equipmentDimensions) {
      if (equipLength['lengthQuantity']) {
        const equipLeng = `${equipLength['lengthQuantity']} ${equipLength['unitOfLengthMeasurementCode']}`;
        this.overviewModel.equipmentLength.push({
          label: equipLeng,
          value: equipLeng,
          id: equipLength['lengthQuantity'],
          specificationId: equipLength['equipmentDimensionId'],
          code: equipLength['unitOfLengthMeasurementCode']
        });
      }
    }
  }
  onTypeEquipmentLength(event: Event) {
    this.overviewModel.equipmentLengthList = [];
    if (this.overviewModel.equipmentLength) {
      this.overviewModel.equipmentLength.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.equipmentLengthList.push({
            label: element.label,
            value: element.value,
            id: element.id,
            code: element.code,
            specificationId: element.specificationId
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  equipmentLengthSelected(equipmentLengths: string) {
    this.overviewModel.equipmentLength.forEach(element => {
      if (equipmentLengths === element['value']) {
        this.overviewModel.equipmentLengthQuantity = element.id;
        this.overviewModel.unitOfEquipmentLengthMeasurementCode = element.code;
        this.overviewModel.equipmentRequirementSpecificationAssociationID = element.specificationId;
      }
    });
  }
  callOperationService() {
    const operationalServiceRequestPayLoad = {
      businessUnit: this.overviewModel.selectedBu,
      serviceOffering: this.overviewModel.selectedServiceOffering,
      serviceCategoryCode: 'ReqServ'
    };
    this.overviewService.getOperationalServices(operationalServiceRequestPayLoad).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((response: Array<OperationalService>) => {
        this.overviewModel.operationalServices = [];
        if (response) {
          response.forEach(element => {
            this.overviewModel.operationalServices.push({
              value: element.serviceTypeCode,
              label: element.serviceTypeDescription
            });
          });
        }
        this.changeDetector.markForCheck();
      }, (operationalServiceError: HttpErrorResponse) => {
        this.ordermngErrHandle(operationalServiceError);
      });
  }
  getOperationalServices() {
    if (!utils.isEmpty(this.overviewModel.overviewForm.controls['businessUnit'].value) &&
      !utils.isEmpty(this.overviewModel.overviewForm.controls['serviceOffering'].value)) {
      this.callOperationService();
    } else {
      this.overviewModel.operationalServices = [];
    }
  }

  getAwardStatus() {
    this.overviewService.getAwardStatus().pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((response: AwardStatus) => {
        if (response && response._embedded && response._embedded.lineHaulAwardStatusTypes) {
          this.overviewModel.awardStatus = [];
          for (const awardStatus of response._embedded.lineHaulAwardStatusTypes) {
            this.overviewModel.awardStatus.push({
              label: awardStatus.awardStatusTypeName,
              value: awardStatus.awardStatusTypeID
            });
          }
        }
        this.changeDetector.detectChanges();
      }, (awardStatusError: HttpErrorResponse) => {
        this.setError(awardStatusError);
      });
  }
  onTypeAwardStatus(event: Event) {
    this.overviewModel.awardStatusList = [];
    if (this.overviewModel.awardStatus) {
      this.overviewModel.awardStatus.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.awardStatusList.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  awardStatusSelected(selectedAwardStatusId: number) {
    this.overviewModel.lineHaulAwardStatusTypeID = selectedAwardStatusId;
  }
  getBusinessUnitList() {
    this.overviewService.getBusinesUnit().pipe(takeWhile(() => this.overviewModel.subscriberFlag)).
      subscribe((response: BusinessUnit) => {
        this.overviewModel.businessUnitList = [];
        if (response && response._embedded.serviceOfferingBusinessUnitTransitModeAssociations) {
          this.overviewModel.businessUnitServiceOffering = response._embedded.serviceOfferingBusinessUnitTransitModeAssociations;
          response._embedded.serviceOfferingBusinessUnitTransitModeAssociations.forEach((element: SoBuAssociation) => {
            this.overviewModel.businessUnitList.push({
              label: element.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitCode,
              value: element.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitCode
            });
          });
          this.overviewModel.businessUnitList = utils.uniqBy(this.overviewModel.businessUnitList, 'label');
          const sortedArray = utils.sortBy(this.overviewModel.businessUnitList, ['label']);
          this.overviewModel.businessUnitList = sortedArray;
          this.changeDetector.detectChanges();
        }
      }, (businessUnitError: HttpErrorResponse) => {
        this.setError(businessUnitError);
      });
  }
  onTypeBusinessValue(event: Event) {
    this.overviewModel.businessUnitFiltered = [];
    if (this.overviewModel.businessUnitList) {
      this.overviewModel.businessUnitList.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.businessUnitFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  businsessUnitSelected(selectedBu: string) {
    this.overviewModel.selectedBu = selectedBu;
    const controls = ['serviceOffering', 'serviceLevel', 'operationalServices'];
    controls.forEach(element => {
      this.overviewModel.overviewForm.controls[element].setValue('');
    });
    this.overviewModel.transitMode = null;
    this.getServiceOffering();
    this.getOperationalServices();
  }
  serviceOfferingSelected(selectedServiceOffering: ServiceOfferingList) {
    this.overviewModel.overviewForm.controls['serviceLevel'].setValue(null);
    this.overviewModel.operationalServices = [];
    this.overviewModel.overviewForm.controls['operationalServices'].setValue(null);
    this.setServiceOffering(selectedServiceOffering);
  }
  setServiceOffering(selectedServiceOffering: ServiceOfferingList) {
    this.overviewModel.selectedServiceOffering = selectedServiceOffering.value;
    this.overviewModel.serviceOfferingID = selectedServiceOffering.id;
    if (this.overviewModel.selectedBu && this.overviewModel.selectedServiceOffering) {
      this.setTransitMode();
    }
    this.getServicelevelList();
    this.getOperationalServices();
  }

  editserviceOfferingSelected(selectedServiceOffering: ServiceOfferingList) {
    this.setServiceOffering(selectedServiceOffering);
  }
  setTransitMode() {
    this.overviewModel.businessUnitServiceOffering.forEach(element => {
      if (this.overviewModel.selectedBu === element.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitCode &&
        this.overviewModel.selectedServiceOffering ===
        element.financeBusinessUnitServiceOfferingAssociation.serviceOfferingCode) {
        this.overviewModel.transitMode = {
          id: Number(element['_links']['self']['href'].split('/').pop()),
          value: element['transitMode']['transitModeCode']
        };
      }
    });
  }

  getServiceOffering() {
    this.overviewModel.serviceOfferingList = [];
    if (this.overviewModel.businessUnitServiceOffering) {
      this.overviewService.getServiceOffering(this.overviewModel.selectedBu).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((serviceOfferingValues: ServiceofferingInterface[]) => {
          this.setServiceOfferings(serviceOfferingValues);
        });
      this.changeDetector.detectChanges();
    }
  }
  setServiceOfferings(serviceOfferingValues: ServiceofferingInterface[]) {
    serviceOfferingValues.forEach((eachServiceOffering: ServiceofferingInterface) => {
      this.overviewModel.serviceOfferingList.push({
        label: eachServiceOffering.serviceOfferingDescription,
        value: eachServiceOffering.serviceOfferingCode,
        id: eachServiceOffering.financeBusinessUnitServiceOfferingAssociationID
      });
    });
    this.overviewModel.serviceOfferingList = utils.uniqBy(this.overviewModel.serviceOfferingList, 'value');
    this.overviewModel.serviceOfferingList = utils.orderBy(this.overviewModel.serviceOfferingList, ['label'], ['asc']);
  }

  onTypeServiceOffering(event: Event) {
    this.overviewModel.serviceOfferingData = [];
    if (this.overviewModel.serviceOfferingList) {
      this.overviewModel.serviceOfferingList.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.serviceOfferingData.push({
            label: element.label,
            value: element.value,
            id: element.id
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  getSectionData() {
    this.overviewModel.sectionData = this.sectionData;
    this.overviewModel.sectionValues = [];
    if (this.overviewModel.sectionData) {
      this.overviewModel.sectionData.forEach((element: SaveResponseDto) => {
        this.overviewModel.sectionValues.push({
          value: element.customerSectionID,
          label: element.customerSectionName
        });
      });
    }
    this.changeDetector.detectChanges();
  }
  onTypeSectionValue(event: Event) {
    this.overviewModel.sectionValuesList = [];
    if (this.overviewModel.sectionValues) {
      this.overviewModel.sectionValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.sectionValuesList.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }
  onSectionSelected(selectedSection: number) {
    this.overviewModel.sectionData.forEach((element: SaveResponseDto) => {
      if (selectedSection === element.customerSectionID) {
        this.overviewModel.contractName = {
          label: element['customerContractNumber'],
          value: element.customerContractName,
          sectionId: element['customerSectionID']
        };
      }
    });
    this.sectionID.emit(this.overviewModel.contractName);
  }
  toastMessage(messageService: MessageService, key: string, data: string) {
    const message = {
      severity: key,
      summary: (key === 'error') ? 'Error' : 'Success',
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
  getOverRiddenPriorityValues() {
    this.overviewModel.overRiddenPriorityValues = [];
    for (let i = 1; i < 71; i++) {
      if (this.overviewModel.priorityLevelNumber !== i) {
        this.overviewModel.overRiddenPriorityValues.push({
          label: i,
          value: i
        });
      }
    }
    this.overviewModel.overRiddenPriorityValues.unshift({ 'label': '0', 'value': '0' });
  }
  onTypePriorityValue(event: Event) {
    this.overviewModel.overRiddenPriorityFiltered = [];
    if (this.overviewModel.overRiddenPriorityValues) {
      this.overviewModel.overRiddenPriorityValues.forEach(element => {
        if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
          this.overviewModel.overRiddenPriorityFiltered.push({
            label: element.label,
            value: element.value
          });
        }
      });
    }
    this.changeDetector.detectChanges();
  }

  onPrioritySelected(selectedPriority: string) {
    this.overviewModel.overriddenPriorityLevelNumber = Number(selectedPriority);
  }
  operationalServiceSelected(event: Event) {
    if (event['value']) {
      this.overviewModel.isOperationalService = true;
    }
  }
  setvalueforOverviewSection() {
    const lineHaulDetailsData = this.utilityService.getEditLineHaulData();
    if (lineHaulDetailsData !== undefined && lineHaulDetailsData.isEditFlag) {
      this.shared.on<LineHaulValues>('editlinehaulDetails').pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((editLineHaulData: LineHaulValues) => {
          if (!utils.isEmpty(editLineHaulData)) {
            this.setEditDataforOverview(editLineHaulData);
            this.getEditSectionDetails(editLineHaulData);
            this.getEditPriorityDetails(editLineHaulData);
            this.overviewModel.editEquipmentLength = editLineHaulData.equipmentRequirementSpecificationAssociationID;
            if (editLineHaulData.operationalServices.length > 0) {
              this.overviewModel.editEquipmentOperational = editLineHaulData.operationalServices;
            }
          }
        });
    }
  }

  setEditEquipmentType() {
    if (this.overviewModel.editEquipmentType) {
      const selectedequipmentType = utils.find(this.overviewModel.equipmentType,
        { 'value': this.overviewModel.editEquipmentType });
      this.overviewModel.overviewForm.controls.equipmentType.
        setValue(selectedequipmentType);
      this.editequipmentTypeSelected(this.overviewModel.editEquipmentType);
      this.changeDetector.detectChanges();
    }

  }

  setEditEquipmentLength() {
    if (this.overviewModel.editEquipmentLength) {
      const selectedequipmentLength = utils.find(this.overviewModel.equipmentLength,
        { 'specificationId': this.overviewModel.editEquipmentLength });
      this.overviewModel.overviewForm.controls.equipmentLength.
        setValue(selectedequipmentLength);
    }
  }

  getEditSectionDetails(linehaulData) {
    if (utils.isEmpty(this.editSectionDate['effectiveDate']) && utils.isEmpty(this.editSectionDate['expirationDate'])) {
      this.editSectionDate.effectiveDate = linehaulData['effectiveDate'];
      this.editSectionDate.expirationDate = linehaulData['expirationDate'];
    }
    this.overviewService.onSaveManualDetails(linehaulData.customerAgreementID,
      this.editSectionDate.effectiveDate, this.editSectionDate.expirationDate)
      .pipe(takeWhile(() => this.overviewModel.subscriberFlag)).subscribe((data: Array<SaveResponseDto>) => {
        if (data) {
          this.sectionData = data;
          this.getSectionData();
          this.editSectionType(linehaulData);
          this.onSectionSelected(linehaulData.customerAgreementContractSectionID);
        }
      });
  }

  getEditPriorityDetails(linehaulData) {
    const obj = {
      originID: linehaulData.originTypeID,
      destinationID: linehaulData.destinationTypeID
    };
    this.getPriorityValues(obj);
  }

  setEditOperationalService() {
    if (this.overviewModel.editEquipmentOperational.length > 0) {
      let editOperationServiceList = [];
      editOperationServiceList = this.getEditOperationalServiceList();
      this.overviewModel.overviewForm.patchValue({
        operationalServices: editOperationServiceList,
      });
      this.overviewModel.isOperationalService = true;
      this.changeDetector.detectChanges();
    }
  }

  editequipmentTypeSelected(equipmentTypes: string) {
    this.overviewModel.equipmentType.forEach(element => {
      if (equipmentTypes === element['value']) {
        this.overviewModel.equipmentTypeCode = element.value;
      }
    });
    this.overviewModel.isEquipmentTypeRequired = false;
    this.getEditEquipmentLength();
  }

  setEditDataforOverview(editLineHaulData) {
    let editbusinessUnit = null;
    let editequipmentCategory = null;
    let editserviceOffering = null;
    let editoverridePriority = null;
    let editawardStatus = null;
    let editserviceLevel = null;
    editbusinessUnit = {
      'label': editLineHaulData.financeBusinessUnitName,
      'value': editLineHaulData.financeBusinessUnitName
    };
    editequipmentCategory = {
      'label': editLineHaulData.equipmentClassificationCode,
      'value': editLineHaulData.equipmentClassificationCode
    };
    editserviceOffering = {
      'label': editLineHaulData.serviceOfferingDescription,
      'value': editLineHaulData.serviceOfferingCode,
      'id': editLineHaulData.financeBusinessUnitServiceOfferingAssociationID
    };
    if (editLineHaulData.overiddenPriorityLevelNumber === 0) {
      const editoverriddenPriority = editLineHaulData.overiddenPriorityLevelNumber.toString();
      editoverridePriority = {
        'label': editoverriddenPriority,
        'value': editoverriddenPriority
      };
    } else {
      editoverridePriority = {
        'label': editLineHaulData.overiddenPriorityLevelNumber,
        'value': editLineHaulData.overiddenPriorityLevelNumber
      };
    }
    editawardStatus = {
      'label': editLineHaulData.lineHaulAwardStatusTypeName,
      'value': editLineHaulData.lineHaulAwardStatusTypeID
    };
    editserviceLevel = {
      'id': editLineHaulData.serviceLevelBusinessUnitServiceOfferingAssociationID,
      'label': editLineHaulData.serviceLevelCode,
      'value': editLineHaulData.serviceLevelCode
    };
    this.overviewModel.overviewForm.patchValue({
      businessUnit: editbusinessUnit,
      serviceOffering: editserviceOffering,
      equipmentCategory: editequipmentCategory,
      awardStatus: editawardStatus,
      overriddenPriority: editoverridePriority,
      serviceLevel: editserviceLevel

    });
    this.overviewModel.priorityLevelNumber = editLineHaulData.priorityLevelNumber;
    this.overviewModel.overriddenPriorityLevelNumber = editLineHaulData.overiddenPriorityLevelNumber;
    this.overviewModel.serviceLevelID = Number(editserviceLevel.id);
    if (editLineHaulData.equipmentTypeCode) {
      this.overviewModel.editEquipmentType = editLineHaulData.equipmentTypeCode;
    }
    this.overviewModel.selectedCategory = editLineHaulData.equipmentClassificationCode;
    this.overviewModel.transitMode = {
      'value': editLineHaulData.transitMode,
      'id': editLineHaulData.serviceOfferingBusinessUnitTransitModeAssociationID
    };
    this.editbusinsessUnitSelected(editLineHaulData);
    if (editLineHaulData.operationalServices.length > 0) {
      this.overviewModel.editEquipmentOperational = editLineHaulData.operationalServices;
    }
  }

  getEditEquipmentType() {
    const selectedCategory = this.overviewModel.selectedCategory;
    const url =
      `?equipmentClassificationCode=${selectedCategory}`;
    if (!utils.isEmpty(this.overviewModel.overviewForm.controls['equipmentCategory'].value)) {
      this.overviewService.getEquipmentType(url).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((response: EquipmentType) => {
          if (response && response._embedded && response._embedded.equipmentTypes) {
            this.overviewModel.equipmentType = [];
            for (const equipType of response._embedded.equipmentTypes) {
              this.overviewModel.equipmentType.push({
                label: equipType.equipmentTypeDescription.trim(),
                value: equipType.equipmentTypeCode.trim()
              });
            }
          }
          this.setEditEquipmentType();
          this.changeDetector.detectChanges();
        }, (equipmentTypeError: HttpErrorResponse) => {
          this.setError(equipmentTypeError);
        });
    } else {
      this.overviewModel.equipmentType = [];
    }
  }

  setError(error: HttpErrorResponse) {
    if (error) {
      this.toastMessage(this.messageService, 'error', error['error']['errors'][0]['errorMessage']);
    }
  }

  getEditEquipmentLength() {
    const selectedCategory = this.overviewModel.selectedCategory;
    const equipmentTypeCode = this.overviewModel.equipmentTypeCode;
    const url = `?equipmentClassificationCode=${selectedCategory}&equipmentTypeCode=${equipmentTypeCode}&sort=lengthQuantity`;
    if (this.overviewModel.equipmentTypeCode) {
      this.overviewService.getEquipmentLength(url).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
        .subscribe((response: EquipmentLength) => {
          if (response && response._embedded && response._embedded.equipmentDimensions) {
            this.equipmentLengthResponse(response);
          }
          this.overviewModel.equipmentLength = utils.uniqBy(this.overviewModel.equipmentLength, 'label');
          this.setEditEquipmentLength();
          this.changeDetector.detectChanges();
        }, (equipmentLengthError: HttpErrorResponse) => {
          this.setError(equipmentLengthError);
        });
    } else {
      this.overviewModel.equipmentLength = [];
      this.overviewModel.overviewForm.controls['equipmentType'].markAsTouched();
      this.overviewModel.overviewForm.get('equipmentType').setValidators([Validators.required]);
      this.overviewModel.overviewForm.get('equipmentType').updateValueAndValidity();
      this.overviewModel.isEquipmentTypeRequired = true;
    }
  }
  getEditOperationService() {
    const operationalServiceRequestPayLoad = {
      businessUnit: this.overviewModel.selectedBu,
      serviceOffering: this.overviewModel.selectedServiceOffering,
      serviceCategoryCode: 'ReqServ'
    };
    this.overviewService.getOperationalServices(operationalServiceRequestPayLoad).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((response: Array<OperationalService>) => {
        this.overviewModel.operationalServices = [];
        if (response) {
          response.forEach(element => {
            this.overviewModel.operationalServices.push({
              value: element.serviceTypeCode,
              label: element.serviceTypeDescription
            });
            this.setEditOperationalService();
          });
        }
        this.changeDetector.markForCheck();
      }, (operationalServiceError: HttpErrorResponse) => {
        this.ordermngErrHandle(operationalServiceError);
      });
  }
  ordermngErrHandle(error: HttpErrorResponse) {
    if (error.status >= 500 ) {
      this.toastMessage(this.messageService, 'error', 'OrderManagementReferenceData service is unavailable');
    } else {
    this.setError(error);
    }
  }
  onClearDropDown(control: string) {
    switch (control) {
      case 'equipmentType':
        this.overviewModel.overviewForm['controls']['equipmentType'].setValue(null);
        this.overviewModel.overviewForm['controls']['equipmentLength'].setValue(null);
        this.overviewModel.equipmentLength = [];
        break;
      case 'equipmentLength':
        this.overviewModel.overviewForm['controls']['equipmentLength'].setValue(null);
        break;
      case 'overriddenPriority':
        this.overviewModel.overviewForm['controls']['overriddenPriority'].setValue(null);
        this.overviewModel.overriddenPriorityLevelNumber = null;
        break;
      case 'serviceLevel':
        this.overviewModel.overviewForm['controls']['serviceLevel'].setValue(null);
        break;
      case 'serviceOffering':
        this.serviceOfferingClear();
        break;
      case 'equipmentCategory':
        this.equipmentCategoryClear();
        break;
      case 'businessUnit':
        this.overviewModel.overviewForm.controls['serviceOffering'].setValue(null);
        this.overviewModel.serviceOfferingData = [];
        this.overviewModel.serviceOfferingList = [];
        this.overviewModel.overviewForm.controls['serviceLevel'].setValue('');
        this.overviewModel.overviewForm.controls['operationalServices'].setValue('');
        this.overviewModel.operationalServices = [];
        this.overviewModel.serviceLevelList = [];
        this.overviewModel.transitMode = null;
        break;
        default:
        break;
    }
  }

  editbusinsessUnitSelected(linehaul: LineHaulValues) {
    this.overviewModel.selectedBu = linehaul.financeBusinessUnitName;
    this.getEditServiceOffering(linehaul);
    this.getOperationalServices();
    this.overviewModel.equipmentTypeCode = '';
    this.overviewModel.equipmentLengthQuantity = null;
    this.overviewModel.unitOfEquipmentLengthMeasurementCode = '';
    this.overviewModel.equipmentRequirementSpecificationAssociationID = null;
  }
  getEditServiceOffering(linehaul: LineHaulValues) {
    this.overviewModel.serviceOfferingList = [];
    this.overviewService.getServiceOffering(this.overviewModel.selectedBu).pipe(takeWhile(() => this.overviewModel.subscriberFlag))
      .subscribe((serviceOfferingValues: ServiceofferingInterface[]) => {
        this.setServiceOfferings(serviceOfferingValues);
        const selectedEditServiceOffering = utils.find(this.overviewModel.serviceOfferingList, {
          'id': linehaul.financeBusinessUnitServiceOfferingAssociationID
        });
        this.editserviceOfferingSelected(selectedEditServiceOffering);
        this.getEditEquipmentType();
        this.getEditOperationService();
      });
  }

  getEditOperationalServiceList() {
    const editOperationService = [];
    utils.each(this.overviewModel.editEquipmentOperational, (value) => {
      utils.each(this.overviewModel.operationalServices, (data) => {
        if (value['serviceTypeCode'] === data['value']) {
          editOperationService.push(data['value']);
        }
      });
    });
    return editOperationService;
  }

  editSectionType(editLineHaulData) {
    const selectedSection = utils.find(this.overviewModel.sectionValues, {
      'value': editLineHaulData['customerAgreementContractSectionID']
    });
    if (selectedSection) {
      this.overviewModel.overviewForm.controls['sectionValue'].setValue(selectedSection);
    } else {
      this.overviewModel.overviewForm.controls['sectionValue'].setValue(null);
      this.overviewModel.contractName = null;
    }
    this.changeDetector.detectChanges();
  }

  equipmentCategoryClear() {
        this.overviewModel.overviewForm.controls['equipmentType'].setValue('');
        this.overviewModel.overviewForm.controls['equipmentLength'].setValue('');
        this.overviewModel.equipmentType = [];
        this.overviewModel.equipmentLength = [];
        this.overviewModel.equipmentTypeCode = '';
        this.overviewModel.equipmentLengthQuantity = null;
        this.overviewModel.unitOfEquipmentLengthMeasurementCode = '';
        this.overviewModel.equipmentRequirementSpecificationAssociationID = null;
  }

  serviceOfferingClear() {
        this.overviewModel.overviewForm.controls['serviceOffering'].setValue('');
        this.overviewModel.transitMode = null;
        this.overviewModel.operationalServices = [];
        this.overviewModel.serviceLevelList = [];
        this.overviewModel.overviewForm.controls['serviceLevel'].setValue('');
        this.overviewModel.overviewForm.controls['operationalServices'].setValue('');
  }
}







