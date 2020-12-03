export class ViewTemplateQuery {
    static getTemplateQuery(searchValue: string, from: number, size: number, field: string, order: string): any {
        return {
            'from': from,
            'size': size,
            '_source': '*',
            'query': {
            'bool': {
                    'must': [
                        {
                            'bool': {
                                'should': [
                                    {
                                        'query_string': {
                                            'fields': [
                                                'emailTemplateTypeName.keyword',
                                                'chargeTypeDisplayName.keyword',
                                                'accessorialNotificationTypeName.keyword',
                                                'emailTemplateReferenceNumber.keyword',
                                                'defaultAttachment.keyword',
                                                'modifiedBy.keyword',
                                                'lastUpdateTimestamp.keyword'
                                            ],
                                            'query': `*${searchValue}*`
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
          sortObj[`emailTemplateTypeName.keyword`] = {
            order: `${order}`
          };
            sortObj[`chargeTypeDisplayName.keyword`] = {
              order: `${order}`
            };
            sortObj[`accessorialNotificationTypeName.keyword`] = {
                order: `${order}`
            };
          return sortObj;
        } else {
            switch (field) {
                case 'emailTemplateTypeName':
                case 'chargeTypeDisplayName':
                case 'modifiedBy':
                case 'accessorialNotificationTypeName':
                case 'emailTemplateReferenceNumber':
                case 'defaultAttachment':
                sortObj[`${field}.keyword`] = {
                    order: `${order}`,
                    missing: order === 'asc' ? '_first' : '_last'
                  };
                  break;
                case 'lastUpdateTimestamp':
                sortObj[`${field}`] = {
                    order: `${order}`,
                    missing: order === 'asc' ? '_first' : '_last'
                  };
                  break;
            }
            return sortObj;
        }
      }
}
