import {
  FilterConfig } from './sections-filter.interface';
export class SectionsFilterConfigModel {
  sectionNameType: FilterConfig;
  sectionType: FilterConfig;
  currency: FilterConfig;
  contract: FilterConfig;
  billToCodes: FilterConfig;
  lastUpdateProgram: FilterConfig;
  createdProgram: FilterConfig;
  createdBy: FilterConfig;
  lastUpdatedBy: FilterConfig;
  status: FilterConfig;
  constructor() {
  }
}
