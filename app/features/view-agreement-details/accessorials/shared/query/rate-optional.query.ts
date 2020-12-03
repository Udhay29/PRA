export class RateOptionalQuery {
  static getCarrierQuery() {
    const params: object = {
      'query': {
        'bool': {
          'must': [
            {
              'match': {
                'CarrierStatus': 'A'
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 100,
      '_source': [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ]
    };
    return params;
  }
}
