import * as moment from 'moment';
import * as utils from 'lodash';
export class DateValidation {
  /** function to handle the date typed in the calendar field
   * @static
   * @param {string} fieldName
   * @param {*} model
   * @param {string} formGroupName
   * @memberof DateValidation
   */
  static onTypeDate(fieldName: string, model: any, formGroupName: string) {
    switch (fieldName) {
      case 'effective':
        model[formGroupName].controls.effectiveDate.setErrors(null);
        if (model[formGroupName].controls['effectiveDate'].value) {
          model.inCorrectEffDateFormat = false;
          model.expirationMinDate = model[formGroupName].controls['effectiveDate'].value;
        }
        break;
      case 'expiration':
        model[formGroupName].controls.expirationDate.setErrors(null);
        if (model[formGroupName].controls['expirationDate'].value) {
          model.inCorrectExpDateFormat = false;
          model.effectiveMaxDate = model[formGroupName].controls['expirationDate'].value;
        }
        break;
      default: break;
    }
  }
  /** function to check the entered effective and expiration date
   * @static
   * @param {*} model
   * @param {string} formGroupName
   * @memberof DateValidation
   */
  static getValidDate(model: any, formGroupName: string) {
    model.isNotValidDate = false;
    const effDateValue = model[formGroupName].controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.inCorrectEffDateFormat = model.effectiveMinDate ? (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0)) : false;
    if (todayDate.getDate() === effDateValue.getDate()) { effDateValue.setHours(0, 0, 0, 0); }
    if (effDateValue && model[formGroupName].controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model[formGroupName].controls['expirationDate'].value.setHours(0, 0, 0, 0) ||
        (model.expirationMaxDate ? effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0) : false));
    }
  }
  /**
   * @static
   * @param {*} model
   * @param {string} formGroupName
   * @memberof DateValidation
   */
  static onSelectExpDate(model: any, formGroupName: string) {
    model.inCorrectExpDateFormat = false;
    if (model[formGroupName].controls['effectiveDate'].value) {
      this.getValidDate(model, formGroupName);
    }
    const expDateValue = model[formGroupName].controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = model.expirationMaxDate ? (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0)) : false;
  }

  static validateDateFormat(event: string, dateStatus: string, model: any): boolean | undefined {
    const date = event;
    const datePat = /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/[0-9]{4}$/;
    const matchArray = date.match(datePat);
    if (matchArray == null || !moment(event, 'MM/DD/YYYY').isValid()) {
      switch (dateStatus) {
        case 'effective':
          model.inCorrectEffDateFormat = true;
          break;
        case 'expiration':
          model.inCorrectExpDateFormat = true;
          break;
      }
      return false;
    }
  }
  /**
   * @static
   * @param {*} model
   * @param {string} formGroupName
   * @memberof DateValidation
   */
  static setFormErrors(model: any, formGroupName: string) {
    const effError = (!model.inCorrectEffDateFormat && utils.isEmpty(model[formGroupName].get('effectiveDate').errors));
    const expError = (!model.inCorrectExpDateFormat && utils.isEmpty(model[formGroupName].get('expirationDate').errors));
    model[formGroupName].controls.effectiveDate.setErrors(effError ? null : (utils.isEmpty(model[formGroupName]
      .get('effectiveDate').errors)) ? {invalid: true} : model[formGroupName].get('effectiveDate').errors);
    model[formGroupName].controls.expirationDate.setErrors(expError ? null : (utils.isEmpty(model[formGroupName]
      .get('expirationDate').errors)) ? {invalid: true} : model[formGroupName].get('expirationDate').errors);
    model[formGroupName].controls.effectiveDate.markAsTouched();
    model[formGroupName].controls.expirationDate.markAsTouched();
  }
  static setDateFieldError(alreadyErrorPresent, formValueDate, error) {
    return (error || !formValueDate) ?  { invalid: true } : null;
  }
}
