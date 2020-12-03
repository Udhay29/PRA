export class CreateMileageQuery {
    static createMileageCarrierData() {
        return {
            'query' : {
                'bool' : {
                   'must' : [
                      {
                         'match': {
                            'CarrierStatus': 'A'
                         }
                      },
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
    }
}

