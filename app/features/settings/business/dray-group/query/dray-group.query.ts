export class DrayGroupQuery {

  static getDrayGroupView(searchText: string, from, size, field, order) {
    return {
      'from': from,
      'size': size,
      'query': {
        'bool': {
          'must': [
            {
              'bool': {
                'should': [
                  {
                    'bool': {
                      'must': [
                        {
                          'range': {
                            'expirationDate': {
                              'gte': 'now/d'
                            }
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidIndicator',
                            'query': 'N'
                          }
                        },
                        {
                          'query_string': {
                            'default_field': 'invalidReasonTypeName',
                            'query': 'Active'
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              'bool': {
                'should': [
                  {
                    'query_string': {
                      'fields': ['drayGroupName.keyword', 'drayGroupCode.keyword', 'rateScopeTypeName.keyword',
                        'effectiveDate.keyword', 'expirationDate.keyword', 'createUserID.keyword',
                        'createProgramName.keyword', 'createTimestamp.keyword', 'lastUpdateProgramName.keyword',
                        'lastUpdateUserID.keyword', 'lastUpdateTimestamp.keyword'],
                      'query': `*${searchText}*`,
                      'default_operator': 'AND'
                    }
                  },
                  {
                    'nested': {
                      'path': 'drayGroupCountries',
                      'query': {
                        'query_string': {
                          'default_field': 'drayGroupCountries.drayGroupCountryName.keyword',
                          'query': `*${searchText}*`,
                          'default_operator': 'AND'
                        }
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }, sort: this.sortObject(field, order)
    };
  }

  static sortObject(field: string, order: string) {
    const sortObj = {};
    if (field === 'initialSort') {
      sortObj[`drayGroupName.keyword`] = {
        order: `${order}`
      };
      sortObj[`drayGroupCode.keyword`] = {
        order: `${order}`
      };
      return sortObj;
    } else {
      switch (field) {
        case 'drayGroupName':
        case 'drayGroupCode':
        case 'lastUpdateUserID':
        case 'lastUpdateProgramName':
        case 'createProgramName':
        case 'createUserID':
        case 'rateScopeTypeName':
          sortObj[`${field}.keyword`] = {
            order: `${order}`,
            missing: order === 'asc' ? '_first' : '_last'
          };
          break;
        case 'lastUpdateTimestamp':
        case 'createTimestamp':
        case 'effectiveDate':
        case 'expirationDate':
          sortObj[`${field}`] = {
            order: `${order}`,
            missing: order === 'asc' ? '_first' : '_last'
          };
          break;
        case 'countriesToShow':
          sortObj[`drayGroupCountries.drayGroupCountryName.keyword`] = {
            order: `${order}`,
            missing: order === 'asc' ? '_first' : '_last',
            nested: {
                      'path': 'drayGroupCountries'
                    },
                    'mode' : 'min'
          };
          break;
      }
      return sortObj;
    }
  }
}
