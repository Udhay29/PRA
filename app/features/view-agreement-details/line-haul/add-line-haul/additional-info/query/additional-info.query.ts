export class AdditionalInfoQuery {
    static additionalInfoCarrierData(userInput: string) {
        return {
            'query': {
                'bool': {
                    'must': [
                        {
                            'match': {
                                'CarrierStatus': 'A'
                            }
                        },
                        {
                            'bool': {
                                'should': [
                                    {
                                        'match': {
                                            'LegalName': `${userInput}*`
                                        }
                                    },
                                    {
                                        'match': {
                                            'CarrierCode': '*'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            'from': 0,
            'size': 25,
            '_source': ['LegalName', 'CarrierCode', 'CarrierID']
        };
    }
}
