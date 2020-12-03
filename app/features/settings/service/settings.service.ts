import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Injectable()
export class SettingsService {

  constructor(private readonly formBuilder: FormBuilder) { }
  getBusinessConfigurables(): FormGroup {
    return this.formBuilder.group({
      documentationTypes: [''],
      sectionTypes: [''],
      cargoApprovalGroup: [''],
      cargoReleaseMin: [''],
      cargoReleaseMax: ['', Validators.required],
      cargoReleaseDefault: ['', Validators.required],
      superUserMaxBackDate: ['', Validators.required],
      userMaxBackDateFuture: ['', Validators.required],
      superUserMaxBackDateFuture: ['', Validators.required],
      userMaxBackDate: ['', Validators.required],
      maxNumberAllowed: [''],
      proposalAutoExpire: [''],
      cubicCapacityWarning: [''],
      fuelReminderEmail: [''],
      branchesWhoCanViewRate: [''],
      whoCanViewRate: [''],
      lTLClasses: [''],
      densityCubicThreshhold: [''],
      linearWarnLevel: [''],
      cubicWarnLevel: [''],
      weightWarning: [''],
      palletWarning: [''],
      contractExpirationNotifybefore: [''],
      noAgreementChangeNotifybefore: [''],
      maxBackDatewithoutwarning: [''],
      maxBackDate: [''],
      futureDateAvailability: [''],
      cubicLength: [''],
      mileage: [''],
      length: [''],
      weight: [''],
      weightBand: [''],
      volume: [''],
      country: [''],
      currency: [''],
      originType: [''],
      destinationType: [''],
      priority: [''],
      lastUpdatedUser: [''],
      accessorialsName: [''],
      rateType: [''],
      ibu: [''],
      accessorialDesc: [''],
      cubicCapacityWarningLevels: [''],
      acceslastUpdatedUser: [''],
      accessinvoiceDate: ['']
    });
  }
  settingConfigurables(): FormGroup {
    return this.formBuilder.group({
      agreementType: ['', Validators.required],
      contractType: ['', Validators.required],
      adminSectionTypes: ['', Validators.required],
      supportedLocTypes: [''],
      supportedRateTypes: [''],
      rateCycle: [''],
      awardStatus: [''],
      rateStatus: [''],
      mileageProgaram: [''],
      randMcNallyMileageVersion: [''],
      randMcNallyPreferenceGroup: [''],
      pcMilerMileageVersion: [''],
      pcMilerPreferenceGroup: [''],
      mileageType: [''],
      Calculation: [''],
      fuelPriceSources: [''],
      fuelRegions: [''],
      supportedTaxTypes: [''],
      freeTimeOperationalEvent: [''],
      accessorialRateType: [''],
      mileageCalculation: ['']
    });
  }

}
