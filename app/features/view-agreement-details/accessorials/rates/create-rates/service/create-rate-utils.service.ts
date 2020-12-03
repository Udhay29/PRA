import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';

import { CreateRatesModel } from '../model/create-rates.model';
import { CreateRateService } from './create-rate.service';
import { takeWhile } from 'rxjs/operators';
import { RateSetUpResponse } from '../../../documentation/create-documentation/model/create-documentation.interface';
import { AgreementCurrencyInterface } from '../model/create-rates.interface';
import { ViewDocumentationComponent } from '../../../shared/view-documentation/view-documentation.component';
import { OptionalAttributesModel } from '../../../shared/models/optional-attributes.model';
import * as utils from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class CreateRateUtilsService {

  constructor(private readonly createRateService: CreateRateService) {
  }

  documentationPostFramer(rateModel: CreateRatesModel) {
    return {
      effectiveDate: this.postDateFormatter(rateModel.createRatesValidation.effectiveDate),
      expirationDate: this.postDateFormatter(rateModel.createRatesValidation.expirationDate),
      customerAgreementId: 400,
      inactivateLevelId: null,
      invalidReasonTypeId: 1,
      chargeTypeId: null,
      chargeTypeName: null,
      customerChargeName: null,
      currencyCode: null,
      equipmentCategoryCode: null,
      equipmentTypeCode: null,
      equipmentLengthId: null,
      equipmentTypeId: null,
      groupRateItemizeIndicator: null,
      groupRateTypeId: null,
      customerAgreementContractSectionAccountsDTOs: null,
      businessUnitServiceOfferingDTOs: null,
      requestServiceDTOs: null,
      carrierDTOs: null,
      customerAccessorialRateChargeDTOs: null,
      customerAccessorialRateAdditionalChargeDTOs: null,
      customerAccessorialRateCriteriaDTOs: null,
      customerAccessorialRateAlternateChargeDTO: null
    };
  }
  postDateFormatter(value: string | Date): string {
    return moment(value).format('YYYY-MM-DD');
  }

  setSuperUserBackDateDays(createRatesModel: CreateRatesModel) {
    this.createRateService.getSuperUserBackDate()
      .pipe(takeWhile(() => createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((backDateRes) => {
        createRatesModel.superUserBackDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      });
  }

  setSuperUserFutureDateDays(createRatesModel: CreateRatesModel) {
    this.createRateService.getSuperFutureBackDate()
      .pipe(takeWhile(() => createRatesModel.createRatesValidation.isSubscribeFlag))
      .subscribe((backDateRes) => {
        createRatesModel.superUserFutureDateDays =
          +backDateRes['_embedded']['configurationParameterDetails'][0]['configurationParameterValue'];
      });
  }
  setAlternateChargeTypesForEdit(parentScope) {
    if (parentScope.createRatesModel.isEditFlagEnabled) {
      parentScope.getQuantityTypeValues();
      parentScope.getAlternateChargeTypeValues();
    }
  }
  setAccessorialRateValues(parentScope, editResponse) {
    parentScope.createRatesModel.editAccessorialWholeResponse = editResponse.editRateData;
    parentScope.createRatesModel.rateConfigurationId = editResponse.rateConfigurationId;
    parentScope.createRatesModel.isEditFlagEnabled = true;
    parentScope.createRatesModel.refreshDocumentResponse = editResponse.refreshDocumentResponse;
    parentScope.createRatesModel.editRequestedServiceResponse = editResponse['editRequestedServiceResponse'];
    parentScope.createRatesModel.breadCrumbList[3] = {
      label: 'Edit Accessorial Rate Setup'
    };
    parentScope.patchValuesToAccessorialRates(editResponse.editRateData);
  }
  getAgreementLevelCurrency(agreementId: string, parentScope) {
    this.createRateService.getAgreementCurrency(agreementId).pipe(takeWhile(() => parentScope.createRatesModel.createRatesValidation.
    isSubscribeFlag)).subscribe((res: AgreementCurrencyInterface[]) => {
      let currency = 'USD';
      if (res.length >= 3) {
        parentScope.createRatesModel.createRatesValidation.invalidAgreementCurrency = true;
      } else if (res.length === 2) {
        if (res[0].currencyCode !== null && res[1].currencyCode !== null) {
          parentScope.createRatesModel.createRatesValidation.invalidAgreementCurrency = true;
        } else {
          parentScope.createRatesModel.createRatesValidation.agreementCurrency = res[0].currencyCode || res[1].currencyCode;
        }
      } else if (res.length === 1) {
        parentScope.createRatesModel.createRatesValidation.agreementCurrency = res[0].currencyCode;
      }
      if (parentScope.createRatesModel.createRatesValidation.agreementCurrency) {
        currency = parentScope.createRatesModel.createRatesValidation.agreementCurrency;
      }
      this.populateCurrencyCode(currency, parentScope);
    });
  }
  populateCurrencyCode(currency: string, parentScope) {
    parentScope.createRatesModel.ratesForm.controls['currency'].setValue({
          label: currency,
          value: currency
    });
    parentScope.changeDetector.detectChanges();
  }
  saveRateSetup(parentScope, params) {
    parentScope.createRatesModel.popUpCoseFlag = true;
    if (!parentScope.createRatesModel.isEditFlagEnabled) {
      parentScope.createDocumentationService.postRateData(params, parentScope.agreementID)
        .pipe(takeWhile(() => parentScope.createRatesModel.createRatesValidation.isSubscribeFlag))
        .subscribe((rateSetUp: RateSetUpResponse) => {
          parentScope.localStore.setAccessorialTab('accessType', 'create', { id: 0, text: 'rates' });
          parentScope.navigateToViewAgreementPage('The rate has been successfully saved.');
          parentScope.changeDetector.detectChanges();
        }, (rateError: Error) => {
          parentScope.accessorialRatesErrorScenario(rateError);
        });
    } else {
      parentScope.createDocumentationService.patchRateData
        (params, parentScope.agreementID, parentScope.createRatesModel.rateConfigurationId)
        .pipe(takeWhile(() => parentScope.createRatesModel.createRatesValidation.isSubscribeFlag))
        .subscribe((editRateSetupValue: RateSetUpResponse) => {
          parentScope.navigateToViewAgreementPage('The rate setup has been successfully saved.');
          parentScope.changeDetector.detectChanges();
        }, (rateError: Error) => {
          parentScope.accessorialRatesErrorScenario(rateError);
        });
    }
  }
  setValuesForSaveCloseDropDown(parenComp) {
    parenComp.createRatesModel.saveCloseDropDown = [
      {
        label: 'Save & Create New', command: () => {
          parenComp.createRatesModel.isSaveCreateNewClicked = true;
          parenComp.createRatesModel.isSaveCreateCopyClicked = false;
          parenComp.savePopupYes();
        }
      },
      {
        label: 'Save & Create Copy', command: () => {
          parenComp.createRatesModel.isSaveCreateCopyClicked = true;
          parenComp.createRatesModel.isSaveCreateNewClicked = false;
          parenComp.savePopupYes();
        }
      }
    ];
  }
  alternateChargeTypeValidation(parenComp) {
    if (parenComp.createRatesModel.ratesForm.controls['chargeType'].value &&
      parenComp.createRatesModel.ratesForm.controls['alternateChargeType'].value &&
      parenComp.createRatesModel.ratesForm.controls['chargeType'].value.label ===
      parenComp.createRatesModel.ratesForm.controls['alternateChargeType'].value.label) {
      parenComp.createRatesModel.ratesForm.controls.alternateChargeType.setErrors({ error: true });
      parenComp.createRatesModel.ratesForm.controls.alternateChargeType.markAsTouched();
      parenComp.createRateUtilityService.toastMessage(parenComp.messageService, 'error', 'Warning',
        'Alternate charge type not allowed as it matches the primary charge');
    }
  }
  onAutoCompleteFiledsBlurred(typedValue: string, controlName: string, parenComp) {
    if (!typedValue && parenComp.createRatesModel.ratesForm.controls[controlName].value) {
      parenComp.createRatesModel.ratesForm.controls[controlName].setValue(null);
      parenComp.createRatesModel.ratesForm.controls[controlName].markAsDirty();
    }
  }
  isCurrerncyAgreementValid(parentComponent) {
    if (!parentComponent.contract && !parentComponent.sectionListModel &&
      parentComponent.createRatesModel.createRatesValidation.invalidAgreementCurrency) {
      parentComponent.createRateUtilityService.toastMessage(parentComponent.messageService, 'error', 'Currency Mismatch',
      'Agreement has sections associated with differing currencies;  accessorial rates must be attached at a lower level.');
      return false;
    }
    return true;
  }
  isCurrencyContractValid(parentComponent) {
    if (parentComponent.contract) {
      const invalidCurrencyContractNames = [];
      parentComponent.contract.contractListModel.selectedContract.forEach((contractValue) => {
        if (contractValue['status'] === 'Inactive' && contractValue['InvalidCurrecyFlag']) {
           invalidCurrencyContractNames.push(contractValue['contractName']);
        }
      });
      const invalidContractNames = invalidCurrencyContractNames.toString().replace(/[,]/gi, ', ');
      if (invalidCurrencyContractNames.length) {
        parentComponent.createRateUtilityService.toastMessage(parentComponent.messageService, 'error', 'Contract Currency Mismatch',
        `Contracts have conflicting currencies defined; conflict contract(s) ${invalidContractNames}.`);
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  isCurrencySectioneValid(parentComponent) {
    if (parentComponent.sectionListModel) {
      const invalidCurrencySectionNames = [];
      parentComponent.sectionListModel.sectionsModel.dataSelected.forEach((sectionValue) => {
        if (sectionValue['status'] === 'Inactive' && sectionValue['InvalidCurrecyFlag']) {
           invalidCurrencySectionNames.push(sectionValue['customerAgreementContractSectionName']);
        }
      });
      const invalidSectionNames = invalidCurrencySectionNames.toString().replace(/[,]/gi, ', ');
      if (invalidCurrencySectionNames.length) {
        parentComponent.createRateUtilityService.toastMessage(parentComponent.messageService, 'error', 'Section Currency Mismatch',
        `Sections have conflicting currencies defined; conflict section(s) ${invalidSectionNames}.`);
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  isCurrencySelectionsValid(parentComponent) {
    const isAgreementValid = this.isCurrerncyAgreementValid(parentComponent);
    const isCurrencyValid = this.isCurrencyContractValid(parentComponent);
    const isSectionValid = this.isCurrencySectioneValid(parentComponent);
    if (isAgreementValid && isCurrencyValid && isSectionValid) {
      return true;
    }
    return false;
  }
  onClearChargeType(parentComponent) {
    parentComponent.createRatesModel.ratesForm.controls['chargeType'].setValue('');
    parentComponent.optionalFields.optionalAttributesModel.optionalForm.controls.businessUnit.reset();
    parentComponent.optionalFields.optionalAttributesModel.optionalForm.controls.serviceLevel.reset();
    parentComponent.optionalFields.optionalAttributesModel.optionalForm.controls.requestedService.reset();
    parentComponent.optionalFields.optionalAttributesModel.businessUnitData = [];
    parentComponent.optionalFields.optionalAttributesModel.serviceLevel = [];
    parentComponent.optionalFields.optionalAttributesModel.operationalService = [];
    parentComponent.optionalFields.optionalAttributesModel.businessUnitAdded = false;
    parentComponent.optionalFields.optionalAttributesModel.serviceLevelAdded = false;
    parentComponent.optionalFields.optionalAttributesModel.operationalServiceAdded = false;
    parentComponent.selectedBuSoOnly([]);
    parentComponent.createRatesModel.buSo = [];
  }
  getAttributeLevel(optionalModel: OptionalAttributesModel) {
    optionalModel.attribteLevel = 12;
    if (this.isBU(optionalModel)) {
      optionalModel.attribteLevel--;
      if (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) {
        optionalModel.attribteLevel--;
        this.checkEquipmentLevels(optionalModel, 7);
      } else {
        this.checkEquipmentLevels(optionalModel, 10);
      }
    } else {
      this.checkEquipmentLevels(optionalModel, 4);
    }
    return optionalModel.attribteLevel;
  }
  checkEquipmentLevels(optionalModel: OptionalAttributesModel, level: number) {
    if (optionalModel.optionalForm.controls['equipmentCategory'].value) {
      optionalModel.attribteLevel = level;
      optionalModel.attribteLevel--;
      if (optionalModel.optionalForm.controls['equipmentType'].value) {
        optionalModel.attribteLevel--;
      }
      if (optionalModel.optionalForm.controls['equipmentLength'].value) {
        optionalModel.attribteLevel--;
      }
    }
  }
  isBU(optionalModel: OptionalAttributesModel): boolean {
    return !utils.isEmpty(optionalModel.serviceLevelValues) && !utils.isEmpty(optionalModel.optionalForm.controls['businessUnit'].value);
  }
  createRatesForm(createRatesModel: CreateRatesModel, formBuilder: FormBuilder) {
    createRatesModel.ratesForm = formBuilder.group({
      effectiveDate: ['', Validators.required],
      expirationDate: ['', Validators.required],
      documentationLevel: ['', Validators.required],
      chargeType: ['', Validators.required],
      customerName: [''],
      currency: ['', Validators.required],
      waived: [''],
      calculateRate: [''],
      passThrough: [''],
      rollUp: [''],
      quantity: ['', [Validators.pattern('[-0-9., ]*')]],
      quantityType: [''],
      alternateChargeType: ['']
    });
    createRatesModel.ratesForm.controls['documentationLevel'].setValue('Agreement');
    createRatesModel.ratesDocumentLevel = 'Agreement';
  }
}
