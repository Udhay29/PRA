import { CreateCarrierMileageModel } from '../models/create-carrier-mileage.model';
import { MessageService } from 'primeng/components/common/messageservice';

export class CreateCarrierMileageUtility {

  static validateDateFormat(event: Event, dateStatus: string, model): boolean | undefined {
    const date = event.srcElement['value'];
    const datePat = /^(\d{1,2})(\/)(\d{1,2})\2(\d{4}|\d{4})$/;
    const matchArray = date.trim().match(datePat);
    if (matchArray === null) {
      switch (dateStatus) {
        case 'effectiveDate':
          model.isCorrectEffDateFormat = true;
          model.effDate = new Date();
          break;
        case 'expirationDate':
          model.expDate = new Date();
          model.isCorrectExpDateFormat = true;
      }
      return false;
    } else {
      this.setDateValues(model, dateStatus, date);
    }
  }
  static setDateValues(model, dateStatus, typedDate) {
    switch (dateStatus) {
      case 'effectiveDate':
        model.effDate = new Date(typedDate);
        break;
      case 'expirationDate':
        model.expDate = new Date(typedDate);
    }
  }
  static getValidDate(model: CreateCarrierMileageModel) {
    model.isNotValidDate = false;
    const effDateValue = model.createMileageForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.isCorrectEffDateFormat = (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0));
    if (todayDate.getDate() === effDateValue.getDate()) {
      effDateValue.setHours(0, 0, 0, 0);
    }
    if (effDateValue && model.createMileageForm.controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model.createMileageForm.controls['expirationDate'].value.setHours(0, 0, 0, 0)
        || effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }
  static onSelectExpDate(model: CreateCarrierMileageModel) {
    model.isCorrectExpDateFormat = false;
    if (model.createMileageForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.createMileageForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.isCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  static setFormErrors(model: CreateCarrierMileageModel) {
    const isEffError = (model.isCorrectEffDateFormat || model.isNotValidDate);
    const isExpError = (model.isCorrectExpDateFormat || model.isNotValidDate);
    model.createMileageForm.controls.effectiveDate.setErrors(isEffError ? { invalid: true } : null);
    model.createMileageForm.controls.expirationDate.setErrors(isExpError ? { invalid: true } : null);
  }

  static toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }

  static viewReset(model: CreateCarrierMileageModel) {
    model.createMileageForm.reset();
  }
  static carrierMileageChangeAgreement(model: CreateCarrierMileageModel) {
    model.isShowAffilcation = true;
    model.isShowAgreementBillTO = false;
    model.isShowSection = false;

  }
  static carrierMileageChangeSection(model: CreateCarrierMileageModel) {
    model.isShowAgreementBillTO = false;
    model.isShowAffilcation = false;
    model.isShowSection = true;
  }
  static carrierMileageChangeBillTo(model: CreateCarrierMileageModel) {
    model.isShowAgreementBillTO = true;
    model.isShowAffilcation = false;
    model.isShowSection = false;
  }
}
