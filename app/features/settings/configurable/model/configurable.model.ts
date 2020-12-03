
export class ConfigurableModel {
  dataHandler: object;
  outPutdataHandler: object;
  routeUrl: string;
  cargoReleaseFieldInvalid: boolean;
  pageLoading: boolean;
  constructor() {
    this.dataHandler = {
      'super_user_back_date_days_max': 'superUserMaxBackDate',
      'super_user_future_date_days_max': 'superUserMaxBackDateFuture',
      'user_back_date_days_max': 'userMaxBackDate',
      'user_future_date_days_max': 'userMaxBackDateFuture',
      'cargo_release_default': 'cargoReleaseDefault',
      'cargo_release_max': 'cargoReleaseMax'
    };
    this.outPutdataHandler = {
      'superUserMaxBackDate': 'super_user_back_date_days_max',
      'superUserMaxBackDateFuture': 'super_user_future_date_days_max',
      'userMaxBackDate': 'user_back_date_days_max',
      'userMaxBackDateFuture': 'user_future_date_days_max',
      'cargoReleaseDefault': 'cargo_release_default',
      'cargoReleaseMax': 'cargo_release_max'
    };
  }
}
