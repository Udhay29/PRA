export class AddSectionQuery {
  /** ES Query to fetch data to display in sections table
   * @static
   * @param {number} agreementId
   * @returns {object}
   * @memberof AddSectionQuery*/
  static getTableQuery(agreementId: number): object {
    return {
      '_source': [],
      'query': {
        'match': {
          'AgreementID.keyword': `${agreementId}`
        }
      },
      'sort': [
        {
          'SectionRanges.SectionName.keyword': {
            'order': 'asc'
          }
        }
      ]
    };
  }
}
