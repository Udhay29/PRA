import * as utils from 'lodash';
import { LaneCardModel } from './../lane-card/model/lane-card.model';
export class AddLineHaulUtility {
  static regionPayloadFramer(laneCardModel: LaneCardModel, controlName: string, countryField: string, pointType: string) {
    const payloadStructure = [];
    utils.forEach(laneCardModel.laneCardForm.get(controlName).value, (value) => {
      const pointTypeValue = (pointType === 'City State Region') ? 'City State' : utils.isNumber(value.value) ?
      '3-Zip' : laneCardModel.threeZipRange;
      const pointDetailsObj = {
        pointType: null, pointTypeID: null, point: null, pointID: null,
        address1: null, address2: null,
        city: null, stateCode: null, countryCode: null, country: null, postalCode: null,
        pointLowerBoundID: null, pointLowerBound: null, pointUpperBoundID: null, pointUpperBound: null,
      };
      pointDetailsObj.pointType = utils.filter(laneCardModel.geographyValues, ['label', pointTypeValue])[0].label;
      pointDetailsObj.pointTypeID = utils.filter(laneCardModel.geographyValues, ['label', pointTypeValue])[0].value;
      if (pointTypeValue !== laneCardModel.threeZipRange) {
        pointDetailsObj.point = value.label;
        pointDetailsObj.pointID = value.value;
      }
      if (pointTypeValue === 'City State') {
        pointDetailsObj.city = value.dtoValues.cityName;
        pointDetailsObj.stateCode = value.dtoValues.stateCode;
      }
      pointDetailsObj.countryCode =  laneCardModel.laneCardForm.get(countryField).value.value;
      pointDetailsObj.country = laneCardModel.laneCardForm.get(countryField).value.label;
      if (pointTypeValue === laneCardModel.threeZipRange) {
        pointDetailsObj.pointLowerBoundID = value.value.from.value;
        pointDetailsObj.pointLowerBound = value.value.from.label;
        pointDetailsObj.pointUpperBoundID = value.value.to.value;
        pointDetailsObj.pointUpperBound = value.value.to.label;
      }
      payloadStructure.push(pointDetailsObj);
    });
    return payloadStructure;
  }
  static checkValidRegion(laneCardModel: LaneCardModel) {
    let validFlag = true;
    if (laneCardModel.laneCardForm.valid) {
      const isValidOrigin = laneCardModel.laneCardForm.controls['originType'].value.label.includes('Region') ?
      this.checkRegionValue(laneCardModel, 'originPoint') : true;
      const isValidDestination = laneCardModel.laneCardForm.controls['destinationType'].value.label.includes('Region') ?
      this.checkRegionValue(laneCardModel, 'destinationPoint') : true;
      validFlag = isValidOrigin && isValidDestination;
    }
    return validFlag;
  }
  static checkRegionValue(laneCardModel: LaneCardModel, pointName: string) {
    return laneCardModel.laneCardForm.value[pointName].length > 1;
  }
}
