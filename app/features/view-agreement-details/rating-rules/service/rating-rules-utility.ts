import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import * as moment from 'moment';

import { RatingRulesModel } from './../model/rating-rules.model';
import {
  RootObject, RuleCriteriasItem, RuleCriteriaValuesItem, SaveRequest, EditRequest, ServiceOfferingBusinessUnitTransitModeAssociationsItem,
  ListItem, ContractsListItem, DateFormat, ContractTableFormat, SaveContractsItem, SectionList, SectionTableFormat, SectionSaveItem
} from '../model/rating-rules.interface';
import { MenuItem } from 'primeng/api';
import { Validators } from '@angular/forms';
export class RatingRulesUtility {
  /** traverse the response object to find the rating criterias
   * @static
   * @param {RootObject} data
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static ratingRulesCriteria(data: RootObject, model: RatingRulesModel) {
    if (!utils.isEmpty(data) && !utils.isEmpty(data._embedded) && !utils.isEmpty(data._embedded.ruleCriterias)) {
      utils.forEach(data._embedded.ruleCriterias, (rulecriteria: RuleCriteriasItem) => {
        this.findCriteria(rulecriteria, model);
      });
    } else {
      model.isRuleLoading = false;
    }
  }
  /** used to separate 3 criterias and assigning it to its corresponding model variables
   * @static
   * @param {RuleCriteriasItem} rulecriteria
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static findCriteria(rulecriteria: RuleCriteriasItem, model: RatingRulesModel) {
    switch (rulecriteria.ruleCriteriaName) {
      case model.ruleCriteriaNameList[0].label:
        model.congestionChargeList = this.getCriteriaValues(rulecriteria);
        break;
      case model.ruleCriteriaNameList[1].label:
        model.flatRateList = this.getCriteriaValues(rulecriteria);
        break;
      case model.ruleCriteriaNameList[2].label:
        model.hazmatChargeList = this.getCriteriaValues(rulecriteria);
        break;
      default: break;
    }
    model.isRuleLoading = false;
  }

  static getCriteriaValues(rulecriteria: RuleCriteriasItem): RuleCriteriaValuesItem[] {
    const valuesList = [];
    utils.forEach(rulecriteria.ruleCriteriaValues, (values: RuleCriteriaValuesItem) => {
      values['ruleCriteriaID'] = rulecriteria.ruleCriteriaID ? rulecriteria.ruleCriteriaID : null;
      values['ruleCriteriaName'] = rulecriteria.ruleCriteriaName ? rulecriteria.ruleCriteriaName : '';
      valuesList.push(values);
    });
    return valuesList;
  }
  /** function that calls messageservice to display error/success/warning toast message
   * @static
   * @param {MessageService} messageService
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @memberof RatingRulesUtility */
  static toastMessage(messageService: MessageService, type: string, title: string, message: string) {
    messageService.clear();
    messageService.add({
      severity: type,
      summary: title,
      detail: message
    });
  }

  static createRequestParam(model: RatingRulesModel): SaveRequest {
    return {
      citySubstitutionIndicator: model.ratingRulesForm.get('citySubstitution').value ? 'Y' : 'N',
      citySubstitutionRadiusValue: model.ratingRulesForm.get('radius').value,
      citySubstitutionUnitofLengthMesurement: model.ratingRulesForm.get('radius').value ? 'Miles' : null,
      effectiveDate: moment(model.ratingRulesForm.get('effectiveDate').value).format().split('T')[0],
      expirationDate: moment(model.ratingRulesForm.get('expirationDate').value).format().split('T')[0],
      customerRatingRuleConfigurationInputDTOs: this.ratingRuleConfigurationParam(model),
      customerRatingRuleBusinessUnitAssociationInputDTOs: utils.isEmpty(model.ratingRulesForm.get('businessUnit').value) ? null :
        model.ratingRulesForm.get('businessUnit').value,
      customerRatingRuleContractAssociationInputDTOs: this.getSelectedContract(model),
      customerRatingRuleSectionAssociationInputDTOs: this.getSelectedSection(model),
      ratingRuleAction: model.ratingRuleEditFlag ? 'EDIT' : 'CREATE',
      ratingRuleLevel: (utils.isNull(model.ratingRulesForm.get('businessUnit').value) || utils.isEmpty(model.ratingRulesForm
        .get('businessUnit').value)) ? utils.capitalize(model.ratingRulesForm.get('affiliation').value) :
        `${utils.capitalize(model.ratingRulesForm.get('affiliation').value)}-BU`,
      dateChanged: model.ratingRuleEditFlag ? model.ratingRulesForm.get('effectiveDate').dirty
      || model.ratingRulesForm.get('expirationDate').dirty : false,
      customerRatingRuleIDs: null
    };
  }

  static editRequestParam(model: RatingRulesModel): EditRequest {
    return {
      citySubstitutionIndicator: model.ratingRulesForm.get('citySubstitution').value ? 'Y' : 'N',
      citySubstitutionRadiusValue: model.ratingRulesForm.get('radius').value,
      citySubstitutionUnitofLengthMesurement: model.ratingRulesForm.get('radius').value ? 'Miles' : null,
      effectiveDate: model.ratingRulesForm.get('effectiveDate').value.toISOString().split('T')[0],
      expirationDate: model.ratingRulesForm.get('expirationDate').value.toISOString().split('T')[0],
      customerRatingRuleConfigurationInputDTOs: this.ratingRuleConfigurationParam(model),
      businessUnitServiceOfferingInputDTOs: utils.isEmpty(model.ratingRulesForm.get('businessUnit').value) ? null :
        model.ratingRulesForm.get('businessUnit').value,
      customerAgreementContractAssociationInputDTOs: this.getSelectedContract(model),
      customerAgreementContractSectionAssociationInputDTOs: this.getSelectedSection(model),
      ratingRuleAction: 'EDIT',
      ratingRuleLevel: (utils.isNull(model.ratingRulesForm.get('businessUnit').value) || utils.isEmpty(model.ratingRulesForm
        .get('businessUnit').value)) ? utils.capitalize(model.ratingRulesForm.get('affiliation').value) :
        `${utils.capitalize(model.ratingRulesForm.get('affiliation').value)}-BU`,
      dateChanged: model.ratingRulesForm.get('effectiveDate').dirty || model.ratingRulesForm.get('effectiveDate').touched ||
        model.ratingRulesForm.get('expirationDate').dirty || model.ratingRulesForm.get('expirationDate').touched,
      customerRatingRuleIDs: null
    };
  }

  static ratingRuleConfigurationParam(model: RatingRulesModel): RuleCriteriaValuesItem[] {
    const configurationParam = [];
    utils.forEach(model.ruleCriteriaNameList, (list: MenuItem) => {
      const value = model.ratingRulesForm.get(list.title).value;
      const listName = `${list.title}List`;
      configurationParam.push(utils.filter(model[listName], ['ruleCriteriaValueName', value])[0]);
    });
    return configurationParam;
  }
  /** validates expiration date
   * @static
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static onSelectExpDate(model: RatingRulesModel) {
    model.inCorrectExpDateFormat = false;
    if (model.ratingRulesForm.controls['effectiveDate'].value) {
      this.getValidDate(model);
    }
    const expDateValue = model.ratingRulesForm.controls['expirationDate'].value.setHours(0, 0, 0, 0);
    model.inCorrectExpDateFormat = (expDateValue > model.expirationMaxDate.setHours(0, 0, 0, 0));
  }
  /** checks the entered date exists between range
   * @static
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static getValidDate(model: RatingRulesModel) {
    model.isNotValidDate = false;
    const effDateValue = model.ratingRulesForm.controls['effectiveDate'].value;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    model.inCorrectEffDateFormat = (effDateValue.getTime() < model.effectiveMinDate.setHours(0, 0, 0, 0));
    if (todayDate.getDate() === effDateValue.getDate()) {
      effDateValue.setHours(0, 0, 0, 0);
    }
    if (effDateValue && model.ratingRulesForm.controls['expirationDate'].value) {
      model.isNotValidDate = (effDateValue.getTime() > model.ratingRulesForm.controls['expirationDate'].value.setHours(0, 0, 0, 0) ||
        effDateValue.getTime() > model.expirationMaxDate.setHours(0, 0, 0, 0));
    }
  }

  static validateDateFormat(event, dateStatus: string, model: RatingRulesModel): boolean | undefined {
    const date = event.srcElement['value'];
    const datePat = /^(\d{1,2})(\/)(\d{2})\2(\d{4})$/;
    const matchArray = date.match(datePat);
    if (matchArray == null || !moment(date).isValid()) {
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
  /** set errors for effective and expiration date fields
   * @static
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static setFormErrors(model: RatingRulesModel) {
    const effError = (model.inCorrectEffDateFormat || model.isNotValidDate);
    const expError = (model.inCorrectExpDateFormat || model.isNotValidDate);
    model.ratingRulesForm.controls.effectiveDate.setErrors(effError ? { invalid: true } : null);
    model.ratingRulesForm.controls.expirationDate.setErrors(expError ? { invalid: true } : null);
  }

  static getBusinessUnitServiceOfferingList(offeringList: RootObject): ListItem[] {
    const dropdownList = [];
    if (!utils.isEmpty(offeringList) && !utils.isEmpty(offeringList._embedded) &&
      !utils.isEmpty(offeringList._embedded.serviceOfferingBusinessUnitTransitModeAssociations)) {
      utils.forEach(offeringList._embedded.serviceOfferingBusinessUnitTransitModeAssociations,
        (associationList: ServiceOfferingBusinessUnitTransitModeAssociationsItem) => {
          const dataObject = associationList.financeBusinessUnitServiceOfferingAssociation;
          const objectFormat = {
            value: {
              financeBusinessUnitServiceOfferingAssociationID: dataObject.financeBusinessUnitServiceOfferingAssociationID,
              financeBusinessUnitCode: dataObject.financeBusinessUnitCode,
              serviceOfferingCode: dataObject.serviceOfferingCode,
              financeBusinessUnitServiceOfferingDisplayName: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingCode}`
            }, label: `${dataObject.financeBusinessUnitCode} - ${dataObject.serviceOfferingCode}`
          };
          dropdownList.push(objectFormat);
        });
    }
    return utils.sortBy(dropdownList, ['value.financeBusinessUnitCode', 'value.serviceOfferingCode']);
  }
  /** function to set required validation for businessUnit field
   * @static
   * @param {RatingRulesModel} model
   * @memberof RatingRulesUtility */
  static setBusinessUnitValidation(model: RatingRulesModel) {
    const validation = model.isShowOptional ? null : [Validators.required];
    model.ratingRulesForm.controls['businessUnit'].markAsUntouched();
    model.ratingRulesForm.controls['businessUnit'].setValidators(validation);
    model.ratingRulesForm.controls['businessUnit'].updateValueAndValidity();
  }

  static contractTableList(contractsList: ContractsListItem[]): ContractTableFormat[] {
    const contractDetailList = [];
    utils.forEach(contractsList, (contracts: ContractsListItem) => {
      const contractId = (contracts.contractTypeName === 'Transactional') ? `(${contracts.contractTypeName})` :
        contracts.customerContractNumber;
        const contract = (contracts.contractTypeName === 'Transactional') ? contracts.customerContractName :
        `(${contracts.customerContractName})`;
      const contractObject = {
        effectiveDate: this.datePipe(this.dateObj(contracts.effectiveDate)),
        expirationDate: this.datePipe(this.dateObj(contracts.expirationDate)),
        display: `${contractId} ${contract}`,
        saveData: {
          contractID: contracts.customerAgreementContractID,
          contractName: contracts.customerContractName,
          contractType: contracts.contractTypeName,
          contractNumber: contracts.customerContractNumber,
          contractDisplayName: `${contractId} ${contract}`
        }
      };
      contractDetailList.push(contractObject);
    });
    return contractDetailList;
  }

  static dateObj(effDate: string | Date): DateFormat {
    if (typeof effDate === 'string') {
      const dateFormat = effDate.split('-');
      return {
        date: {
          year: parseInt(dateFormat[0], 10), month: parseInt(dateFormat[1], 10),
          day: parseInt(dateFormat[2].split('T')[0], 10)
        }
      };
    } else {
      return {
        date: {
          year: effDate.getFullYear(), month: effDate.getMonth() + 1, day: effDate.getDate()
        }
      };
    }
  }

  static dateFormatter(value: number): string {
    if (value < 10) {
      return `0${value.toString()}`;
    }
    return value.toString();
  }

  static datePipe(date: DateFormat): string {
    return `${this.dateFormatter(date['date'].month)}/${this.dateFormatter(date['date'].day)}/${date['date'].year}`;
  }

  static checkContracts(model: RatingRulesModel): boolean {
    if (model.ratingRulesForm.get('affiliation').value === 'agreement') {
      return true;
    } else {
      return (!utils.isEmpty(model.selectedList) || !utils.isEmpty(model.sectionSelectedList));
    }
  }

  static getSelectedContract(model: RatingRulesModel): SaveContractsItem[] | null {
    if (model.affiliationValue === 'contract') {
      const contractRequest = [];
      utils.forEach(model.selectedList, (selected: ContractTableFormat) => {
        contractRequest.push(selected.saveData);
      });
      return contractRequest;
    } else {
      return null;
    }
  }

  static sectionTableList(sectionList: SectionList[]): SectionTableFormat[] {
    const sectionTableList = [];
    utils.forEach(sectionList, (sectionDetail: SectionList) => {
      const contractId = (sectionDetail.contractTypeName === 'Transactional') ? `(${sectionDetail.contractTypeName})` :
        sectionDetail.customerContractNumber;
        const contract = (sectionDetail.contractTypeName === 'Transactional') ? sectionDetail.customerContractName :
        `(${sectionDetail.customerContractName})`;
      const tableObjectFormat = {
        effectiveDate: this.datePipe(this.dateObj(sectionDetail.effectiveDate)),
        expirationDate: this.datePipe(this.dateObj(sectionDetail.expirationDate)),
        contractDetail: `${contractId} ${contract}`,
        sectionDetail: sectionDetail.customerAgreementContractSectionName,
        sectionSaveData: {
          sectionID: sectionDetail.customerAgreementContractSectionID,
          sectionName: sectionDetail.customerAgreementContractSectionName
        }
      };
      sectionTableList.push(tableObjectFormat);
    });
    return sectionTableList;
  }

  static getSelectedSection(model: RatingRulesModel): SectionSaveItem[] | null {
    if (model.affiliationValue === 'section') {
      const sectionRequest = [];
      utils.forEach(model.sectionSelectedList, (selected: SectionTableFormat) => {
        sectionRequest.push(selected.sectionSaveData);
      });
      return sectionRequest;
    } else {
      return null;
    }
  }
  /** function to check error of the date picker field
   * @param {string} key
   * @memberof RatingRulesComponent */
  static checkErrors(key: string, model: RatingRulesModel) {
    if (model.ratingRulesForm.get(key).hasError('invalid')) {
      model.ratingRulesForm.get(key).setErrors(null);
      model.ratingRulesForm.get(key).setValidators(Validators.required);
      model.ratingRulesForm.get(key).updateValueAndValidity();
    }
  }
  static isEmptyTable(model: RatingRulesModel, event, flag) {
    if (event.filteredValue.length === 0) {
      model[flag] = true;
    } else {
      model[flag] = false;
    }
  }
}
