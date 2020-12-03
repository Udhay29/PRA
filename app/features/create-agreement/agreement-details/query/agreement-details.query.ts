import { QueryRootObject } from '../model/agreement-details.interface';
export class AgreementDetailsQuery {
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

  static getTeamsQuery(value: string): QueryRootObject {
    return {
      'query': {
        'bool': {
          'must': [
            {
              'query_string': {
                'fields': [
                  'taskGroupName'
                ],
                'query': 'Pricing',
                'split_on_whitespace': false
              }
            },
            {
              'query_string': {
                'fields': [
                  'teamMemberTaskAssignmentRoleAssociationDTOs.teamName'
                ],
                'query': `${value.replace(/[!?:\\["^~=\//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
                'default_operator': 'AND',
                'analyze_wildcard': true
              }
            }
          ]
        }
      },
      'from': 0,
      'size': 10,
      '_source': [
        'taskAssignmentID',
        'orderOwnershipID',
        'taskAssignmentName',
        'taskGroupID',
        'taskGroupName',
        'teamMemberTaskAssignmentRoleAssociationDTOs'
      ]
    };
  }

  static getCarrierQuery(value: string): QueryRootObject {
    return {
      size: 6,
      from: 0,
      _source: [
        'LegalName',
        'CarrierCode',
        'CarrierID'
      ],
      query: {
        bool: {
          must: [
            {
              query_string: {
                fields: [
                  'LegalName',
                  'CarrierCode'
                ],
                query: `${value.replace(/[!?:\\["^~=\//\\{}&&||<>()+*\]-]/g, '')}*`,
                default_operator: 'AND'
              }
            }
          ]
        }
      },
      aggs: {
        unique: {
          terms: {
            field: 'LegalName.keyword',
            size: 5,
            order: {
              _key: 'asc'
            }
          },
          aggs: {
            Level: {
              top_hits: {
                _source: {
                  includes: [
                    'LegalName',
                    'CarrierCode',
                    'CarrierID'
                  ]
                },
                size: 1
              }
            }
          }
        }
      }
    };
  }
}
