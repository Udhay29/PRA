import { QueryRootObject } from '../model/manage-teams.interface';
export class ManageTeamsQuery {
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
                'query': `${value.replace(/[!?:\\['^~=\//\\{}&&||<>()+*\]-]/g, '\\$&')}*`,
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
  static getTaskIdQuery(value: Array<number>): object {
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
            }
          ],
          'filter': {
            'terms': {
              'taskAssignmentID': value
            }
          }
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
}
