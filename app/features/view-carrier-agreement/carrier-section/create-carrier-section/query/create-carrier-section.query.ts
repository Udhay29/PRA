import { QueryRootObject } from '../model/create-carrier-section.interface';

export class CreateCarrierSectionQuery {
  /** function to frame query to fetch account name
   * @static
   * @param {string} value
   * @returns {QueryRootObject}
   * @memberof CreateCarrierSectionQuery
   */
  static getAccountNameQuery(value: string): QueryRootObject {
    return {
      'size': 0,
      '_source': [
        'OrganizationName',
        'Level',
        'OrganizationCode'
      ],
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'default_field': 'Level.keyword',
                'query': 'Ultimate Parent',
                'split_on_whitespace': false
              }
            },
            {
              'query_string': {
                'fields': [
                  'OrganizationName^12',
                  'OrganizationCode^6'
                ],
                'query': `${value.replace(/[!?:\\["^~=\//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
                'default_operator': 'AND',
                'analyze_wildcard': true
              }
            }
          ]
        }
      },
      'aggs': {
        'unique': {
          'terms': {
            'field': 'OrganizationCode.keyword',
            'size': 5
          },
          'aggs': {
            'Level': {
              'top_hits': {
                '_source': {
                  'includes': [
                    'OrganizationName',
                    'OrganizationAliasName',
                    'Level',
                    'OrganizationCode',
                    'OrganizationID'
                  ]
                },
                'size': 5
              }
            }
          }
        }
      }
    };
  }
}
