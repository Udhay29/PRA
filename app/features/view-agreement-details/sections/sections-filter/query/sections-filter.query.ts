import * as utils from 'lodash';

export class SectionsFilterQuery {
    /* query to fetch ContractID, ContractDescription & createdBy */
    static AgreementIdDate = 'AgreementID.keyword';
    static getCurrencyNameQuery(currencyAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': currencyAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': [
                                                    'SectionRanges.SectionCurrencyCode.keyword'
                                                ],
                                                'query': '**',
                                                'default_operator': 'AND'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.SectionCurrencyCode.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.SectionCurrencyCode'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    static getContractNameQuery(ContractAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': ContractAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': ['SectionRanges.contractDisplayName.keyword'],
                                                'query': '**',
                                                'default_operator': 'and'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.contractDisplayName.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.contractDisplayName'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    static getBillToCodesQuery(BillToAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': BillToAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': [
                                                    'SectionRanges.BillToCodes.billingPartyDisplayName.keyword'
                                                ],
                                                'query': '**',
                                                'default_operator': 'AND'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.BillToCodes.billingPartyDisplayName.key',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    static getLastUpdatedProgram(LastUpdateAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': LastUpdateAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': ['SectionRanges.LastUpdateProgram.keyword'],
                                                'query': '**',
                                                'default_operator': 'and'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.LastUpdateProgram.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.LastUpdateProgram'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
     /* query to fetch SectionName */
     static getSectionNameQuery(SectionNameAreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': SectionNameAreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields':  ['SectionRanges.SectionName.keyword'],
                                                'query': '**',
                                                'default_operator': 'AND'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.SectionName.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.SectionName'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
     /* query to fetch SectionType */
    static getSectionTypeQuery(SectionTypeAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': SectionTypeAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields':  ['SectionRanges.SectionTypeName.keyword'],
                                                'query': '**',
                                                'default_operator': 'AND'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.SectionTypeName.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.SectionTypeName'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }


    static getCreatedProgram(CreateProgramAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': CreateProgramAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': ['SectionRanges.CreateProgram.keyword'],
                                                'query': '**',
                                                'default_operator': 'and'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.CreateProgram.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.CreateProgram'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    static getCreatedUser(CreateUserAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': CreateUserAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': ['SectionRanges.CreateUser.keyword'],
                                                'query': '*search-query-text*',
                                                'default_operator': 'and'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.CreateUser.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.CreateUser'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    static getLastUpdatedUser(LastUpdateUserAgreementID) {
        return {
            'size': 0,
            '_source': '',
            'query': {
                'query_string': {
                    'default_field': this.AgreementIdDate,
                    'query': LastUpdateUserAgreementID,
                    'default_operator': 'AND'
                }
            },
            'aggs': {
                'nesting': {
                    'nested': {
                        'path': 'SectionRanges'
                    },
                    'aggs': {
                        'by_contractname': {
                            'filter': {
                                'bool': {
                                    'must': [
                                        {
                                            'query_string': {
                                                'fields': ['SectionRanges.LastUpdateUser.keyword'],
                                                'query': '*search-query-text*',
                                                'default_operator': 'and'
                                            }
                                        }
                                    ]
                                }
                            },
                            'aggs': {
                                'contractname': {
                                    'terms': {
                                        'field': 'SectionRanges.LastUpdateUser.keyword',
                                        'size': 100,
                                        'order': {
                                            '_key': 'asc'
                                        }
                                    },
                                    'aggs': {
                                        'hits': {
                                            'top_hits': {
                                                'size': 1,
                                                '_source': 'SectionRanges.LastUpdateUser'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
}
