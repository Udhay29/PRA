import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as lodashUtils from 'lodash';

import { ListItem } from '../../../features/model/common.interface';
import { isArray } from 'util';

@Component({
  selector: 'app-listing-filter',
  templateUrl: './listing-filter.component.html',
  styleUrls: ['./listing-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingFilterComponent implements OnInit, OnDestroy {
  isChildrAccordianOpened = false;
  filterConfig: any;
  @Input() set config(configData: any) {
    if (configData) {
      this.filterConfig = configData;
      if (configData['expanded']) {
        this.isPanelClosed = !configData['expanded'];
      }
      if (configData['isToggleHidden']) {
        this.isToggleFlag = false;
        this.isPanelClosed = false;
      }
      this.loadFilterData();
    }
  }
  @Input() set selectedList(selctedVal: any) {
    if (isArray(selctedVal)) {
      this.selectedValues = selctedVal;
    }
  }

  @Output() itemsSelected: EventEmitter<Array<ListItem>> = new EventEmitter();
  @Output() resetCall: EventEmitter<boolean> = new EventEmitter();
  @Output() isCollapsed: EventEmitter<boolean> = new EventEmitter();

  itemList: ListItem[] = [];

  filteredItemList: ListItem[] = [];

  selectedValues: ListItem[] = [];

  autocompleteFilter = '';

  scrollHeight = '0';

  errorMessage = '';

  isPanelClosed = true;

  inputTimerSubscription: Subscription;

  subscribeFlag = true;

  isToggleFlag = true;

  constructor(private readonly http: HttpClient, private readonly cdr: ChangeDetectorRef) {
    this.isChildrAccordianOpened = false;
   }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.inputTimerSubscription) {
      this.inputTimerSubscription.unsubscribe();
    }
    this.subscribeFlag = false;
  }
  loadFilterData() {
    if (this.filterConfig.data && this.filterConfig.data.length > 0) {
      this.itemList = lodashUtils.cloneDeep(this.filterConfig.data);
      this.itemList = lodashUtils.sortBy(this.itemList, 'label');
      this.setFilteredItemList('');
      this.setScrollPanelHeight();
    } else if (this.filterConfig && this.filterConfig.url) {
      this.getDataFromService();
    }
  }
  afterPanelToggle(collapsed: boolean) {
    if (this.filterConfig) {
      this.isCollapsed.emit(collapsed);
    }
    this.isPanelClosed = collapsed;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
  closePanel() {
    this.afterPanelToggle(true);
  }
  onSearch(searchText: string) {
    if (this.inputTimerSubscription) {
      this.inputTimerSubscription.unsubscribe();
    }
    this.inputTimerSubscription = timer(300).subscribe(() => {
      this.setFilteredItemList(searchText);
    });
  }
  setFilteredItemList(searchText: string) {
    this.errorMessage = '';
    if (searchText) {
      this.filteredItemList = this.itemList.filter(item => {
        if (item.label && item.label.toString().toLowerCase().indexOf(searchText.toString().toLowerCase()) > -1
          || lodashUtils.includes(this.selectedValues, item)) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      this.filteredItemList = this.itemList;
    }
    if (this.filteredItemList.length < 1) {
      this.errorMessage = 'No Results Found';
    }
    this.cdr.detectChanges();
  }

  getDataFromService() {
    this.errorMessage = '';
    if (this.filterConfig.query) {
      this.getDataByPostMethod();
    } else {
      this.getDataByGetMethod();
    }
  }

  getDataByPostMethod() {
    if (this.filterConfig.url && this.filterConfig.query) {
      this.http.post(this.filterConfig.url, this.filterConfig.query)
        .pipe(takeWhile(() => this.subscribeFlag))
        .subscribe(data => {
          if (data) {
            this.processFetchedData(data);
          }
        });
    }
  }

  getDataByGetMethod() {
    if (this.filterConfig.url) {
      this.http.get(this.filterConfig.url)
        .pipe(takeWhile(() => this.subscribeFlag))
        .subscribe(fetchedData => {
          if (fetchedData) {
            this.processFetchedData(fetchedData);
          }
        });
    }
  }

  processFetchedData(data: any) {
    if (this.filterConfig.callback) {
      this.itemList = this.filterConfig.callback(data);
      this.itemList = lodashUtils.sortBy(this.itemList, 'label');
      this.setFilteredItemList('');
      if (this.itemList.length < 1) {
        this.errorMessage = 'No Results Found';
      } else {
        this.setScrollPanelHeight();
      }
      this.cdr.detectChanges();
    }
  }

  onCheckBoxSelect() {
    const unSelectedList = this.filteredItemList.filter(item => this.selectedValues.indexOf(item) === -1);
    this.filteredItemList = this.selectedValues.concat(unSelectedList);
    this.itemsSelected.emit(this.selectedValues);
  }

  onReset(emit: boolean = true) {
    this.resetCall.emit(true);
    this.selectedValues = [];
    this.errorMessage = '';
    this.autocompleteFilter = '';
    if (emit) {
      this.onCheckBoxSelect();
    }
    this.filteredItemList = this.itemList;
    this.cdr.detectChanges();
  }

  setScrollPanelHeight() {
    this.scrollHeight = (this.itemList.length > 5) ? '160px' : `${(this.itemList.length * 30) + 20}px`;
  }
}
