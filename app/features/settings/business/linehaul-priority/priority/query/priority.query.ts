
export class PriorityQuery {

    static viewPriorityData() {
        return {
            'from': 0,
            'size': 25,
            '_source': ['lineHaulPriorityGroupNumber', 'originPointPriorityGroupName', 'destinationPointPriorityGroupName'],
            'query': {
              'bool': {
                'must': [
                  {
                    'bool': {
                      'should': [
                        {
                          'query_string': {
                            'fields': ['lineHaulPriorityGroupNumber', 'originPointPriorityGroupName', 'destinationPointPriorityGroupName'],
                            'query': '*',
                            'default_operator': 'AND'
                          }
                        }
                      ]
                    }
                  },
                  {
                    'bool': {
                      'must': [
                        {
                          'query_string': {
                            'default_field': 'destinationPointPriorityGroupName.keyword',
                            'query': '*'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'lineHaulPriorityGroupNumber.keyword',
                            'query': '*'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'originPointPriorityGroupName.keyword',
                            'query': '*'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            'sort': [
              {
                'lineHaulPriorityGroupNumber.integer': {
                  'order': 'desc'
                }
              }
            ]
          };
}
}
