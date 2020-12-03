import * as utils from 'lodash';
import * as moment from 'moment';
import { takeWhile } from 'rxjs/operators';


export class CreateRuleStandardUtilsService {
    static onRefreshRatePostFramer(ruleModel, optionalModel): Object {
        return {
          effectiveDate: this.postDateFormatter(ruleModel.rulesForm.controls['effectiveDate'].value),
          expirationDate: this.postDateFormatter(ruleModel.rulesForm.controls['expirationDate'].value),
          customerChargeName: null,
          customerAgreementId: null,
          level: 1,
          accessorialDocumentTypeId: 1,
          ruleType:  (ruleModel.rulesForm.controls['ruleType'].value) ?
          ruleModel.rulesForm.controls['ruleType'].value['label'] : null,
          chargeTypeId: (ruleModel.rulesForm.controls['chargeType'].value) ?
            ruleModel.rulesForm.controls['chargeType'].value['value'] : null,
          chargeTypeName: (ruleModel.rulesForm.controls['chargeType'].value) ?
            ruleModel.rulesForm.controls['chargeType'].value['label'] : null,
          accessorialGroupTypeId: (ruleModel.rulesForm.controls['groupName'].value) ?
          ruleModel.rulesForm.controls['groupName'].value['value'] : null,
          accessorialGroupTypeName: (ruleModel.rulesForm.controls['groupName'].value) ?
          ruleModel.rulesForm.controls['groupName'].value['label'] : null,
          currencyCode: 'USD',
          equipmentCategoryCode: (optionalModel.optionalForm.controls['equipmentCategory'].value) ?
            optionalModel.optionalForm.controls['equipmentCategory'].value['value'] : null,
          equipmentTypeCode: (optionalModel.optionalForm.controls['equipmentType'].value) ?
            optionalModel.optionalForm.controls['equipmentType'].value['value'] : null,
          equipmentLengthId: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
            optionalModel.optionalForm.controls['equipmentLength'].value['id'] : null,
          equipmentLengthDescription: (optionalModel.optionalForm.controls['equipmentLength'].value) ?
            optionalModel.optionalForm.controls['equipmentLength'].value['value'] : null,
          equipmentLength : (optionalModel.optionalForm.controls['equipmentLength'].value) ?
            optionalModel.optionalForm.controls['equipmentLength'].value['label'] : null,
          equipmentTypeId: (optionalModel.optionalForm.controls['equipmentType'].value) ?
            optionalModel.equipTypeId : null,
          customerAccessorialAccountDTOs: null,
          businessUnitServiceOfferingDTOs: (!utils.isEmpty(optionalModel.serviceLevelValues)) ?
            this.iterateBusinessUnitValues(optionalModel) : null,
          requestServiceDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) ?
            this.iterateRequestedService(optionalModel) : null,
          carrierDTOs: (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) ? this.iterateCarriers(optionalModel) : null
        };
      }
      static postDateFormatter(value: string | Date): string {
        return moment(value).format('YYYY-MM-DD');
      }
      static iterateBusinessUnitValues(optionalModel) {
        const businessUnits = [];
        if (!utils.isEmpty(optionalModel.serviceLevelValues && optionalModel.optionalForm.controls['businessUnit'].value)) {
          optionalModel.optionalForm.controls['businessUnit'].value.forEach(businessUnitValues => {
            optionalModel.serviceLevelResponse.forEach((serviceLevel) => {
              const businessUnit = {
                customerAccessorialServiceLevelBusinessUnitServiceOfferingId: null,
                serviceLevelBusinessUnitServiceOfferingAssociationId: null,
                businessUnit: businessUnitValues['financeBusinessUnitCode'],
                serviceOffering: businessUnitValues['serviceOfferingDescription'],
                serviceOfferingCode:  businessUnitValues['serviceOfferingCode'],
                businessUnitDisplayName:
                `${businessUnitValues['financeBusinessUnitCode']} - ${businessUnitValues['serviceOfferingDescription']}`,
                serviceLevel: null
              };
              const businessData = this.serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit);
              if (!utils.isEmpty(businessData)) {
                businessUnits.push(businessData);
              }
            });
          });
        }
        return businessUnits;
      }
      static  serviceLevelValidation(businessUnitValues, optionalModel, serviceLevel, businessUnit) {
        let businessUnits;
        const businessAssocicationId = businessUnitValues.financeBusinessUnitServiceOfferingAssociationID;
        const serviceAssociationId =
          serviceLevel.financeBusinessUnitServiceOfferingAssociation.financeBusinessUnitServiceOfferingAssociationID;
        if (businessAssocicationId === serviceAssociationId && !utils.isEmpty(optionalModel.optionalForm.controls['serviceLevel'].value)) {
          optionalModel.optionalForm.controls['serviceLevel'].value.forEach(element => {
            if (element.label.toLowerCase() === serviceLevel.serviceLevel['serviceLevelDescription'].toLowerCase()) {
              businessUnit.serviceLevel = serviceLevel.serviceLevel.serviceLevelDescription;
              businessUnit.serviceLevelBusinessUnitServiceOfferingAssociationId =
                serviceLevel.serviceLevelBusinessUnitServiceOfferingAssociationID;
              businessUnits = businessUnit;
            }
          });
        }
        return businessUnits;
      }
    static iterateRequestedService(optionalModel) {
        const requestedServices = [];
        if (!utils.isEmpty(optionalModel.optionalForm.controls['requestedService'].value)) {
          optionalModel.optionalForm.controls['requestedService'].value.forEach(requestedServicesElement => {
            requestedServices.push({
              requestedServiceTypeCode: requestedServicesElement
            });
          });
        }
        return requestedServices;
      }
      static  iterateCarriers(optionalModel) {
        const carriers = [];
        if (!utils.isEmpty(optionalModel.optionalForm.controls['carriers'].value)) {
          optionalModel.optionalForm.controls['carriers'].value.forEach(carriersElement => {
            carriers.push({
              carrierId: Number(carriersElement.value['id']),
              carrierName: carriersElement.value['name'],
              carrierCode: carriersElement.value['code'],
              carrierDisplayName: `${carriersElement.value['name']} (${carriersElement.value['code']})`
            });
          });
        }
        return carriers;
      }
      static getGroupNames(parentScope) {
        parentScope.createRuleModel.loading = true;
        parentScope.createRulesService.getGroupNames().pipe(takeWhile(() => parentScope.createRuleModel.isSubscribeFlag))
        .subscribe((res) => {
          parentScope.createRuleModel.loading = false;
          parentScope.createRuleModel.groupNameValues = res._embedded.accessorialGroupTypes.map((value) => {
            return {
              label : value.accessorialGroupTypeName,
              value : value.accessorialGroupTypeId
            };
          });
          this.populateGroupName(parentScope);
        }, (groupNameError: Error) => {
          parentScope.createRuleModel.loading = false;
          parentScope.createRuleUtilityService.
          toastMessage(parentScope.messageService, 'error', 'Error', groupNameError['error']['errors']['errorMessage']);
        });
      }
      static onTypeGroupNameUtil(event,  parentScope) {
        parentScope.createRuleModel.groupNameSuggestions = [];
        if (parentScope.createRuleModel.groupNameValues) {
          parentScope.createRuleModel.groupNameValues.forEach(element => {
            if (element.label && element.label.toString().toLowerCase().indexOf(event['query'].toLowerCase()) !== -1) {
              parentScope.createRuleModel.groupNameSuggestions.push({
                label: element.label,
                value: element.value
              });
            }
          });
          parentScope.createRuleModel.groupNameSuggestions =  utils.sortBy(parentScope.createRuleModel.groupNameSuggestions, ['label']);
        }
      }
      static populateGroupName(parentScope) {
        if (parentScope.createRuleModel.groupNameValues) {
          parentScope.createRuleModel.rulesForm.controls['groupName'].
          setValue(parentScope.createRuleModel.groupNameValues[0]);
          parentScope.changeDetector.detectChanges();
        }
      }
}
