import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as lodashUtils from 'lodash';

import { ListItem } from '../../../features/model/common.interface';

@Component({
  selector: 'app-radio-filter',
  templateUrl: './radio-filter.component.html',
  styleUrls: ['./radio-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioFilterComponent implements OnInit {
  isRadioFilterAccordianOpened = false;
  filterConfig: any;
  @Input() set config(filterData: any) {
    if (filterData) {
      this.filterConfig = filterData;
      this.loadFilterData();
    }
  }

  @Output() itemsSelected: EventEmitter<ListItem> = new EventEmitter();

  itemList: ListItem;

  selectedValue: ListItem;

  isPanelClosed = true;

  constructor(private readonly cdr: ChangeDetectorRef) {
    this.isRadioFilterAccordianOpened = false;
  }

  ngOnInit() { }

  loadFilterData() {
    if (this.filterConfig && this.filterConfig.data && this.filterConfig.data.length > 0) {
      this.itemList = lodashUtils.cloneDeep(this.filterConfig.data);
    }
  }

  afterPanelToggle(collapsed: boolean) {
    this.isPanelClosed = collapsed;
    this.cdr.detectChanges();
  }
  closePanel() {
    this.afterPanelToggle(true);
  }
  onRadioSelect(selItem: ListItem) {
    this.itemsSelected.emit(this.selectedValue);
  }
  onReset(emit: boolean = true) {
    this.selectedValue = null;
    if (emit) {
      this.onRadioSelect(null);
    }
    this.cdr.detectChanges();
  }
}
