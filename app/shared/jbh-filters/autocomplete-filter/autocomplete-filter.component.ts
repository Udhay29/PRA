import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import * as utils from 'lodash';

import { ListItem } from '../../../features/model/listitem.interface';

@Component({
  selector: 'app-autocomplete-filter',
  templateUrl: './autocomplete-filter.component.html',
  styleUrls: ['./autocomplete-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteFilterComponent implements OnInit, OnDestroy {
  isChildAccordianOpened = false;
  filterConfig: any;
  @Input() set config(val: any) {
    if (val) {
      this.filterConfig = val;
      if (val['expanded']) {
        this.isPanelClosed = !val['expanded'];
      }
      if (val['isToggleHidden']) {
        this.isToggleFlag = false;
        this.isPanelClosed = false;
      }
    }
  }
  @Output() itemsSelected: EventEmitter<Array<ListItem>> = new EventEmitter();

  autocompleteModel: any;

  suggestionList: ListItem[] = [];

  selectedItemList: ListItem[] = [];

  selectedValues: ListItem[] = [];

  scrollHeight = '0';

  errorMessage = '';

  isPanelClosed = true;

  subscribeFlag = true;

  isToggleFlag = true;

  constructor(private readonly http: HttpClient, private readonly cdr: ChangeDetectorRef) {
    this.isChildAccordianOpened = false;
   }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscribeFlag = false;
  }

  afterPanelToggle(collapsed: boolean) {
    this.isPanelClosed = collapsed;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
  closePanel() {
    this.afterPanelToggle(true);
  }
  onSearch(searchQuery: string) {
    const elasticParams: any = this.getQuery(searchQuery);
    this.errorMessage = '';
    this.http.post(this.filterConfig.url, elasticParams)
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe(data => {
        if (this.filterConfig && this.filterConfig.callback) {
          this.suggestionList = this.filterConfig.callback(data);
          if (this.suggestionList.length < 1) {
            this.errorMessage = 'No Results Found';
          }
          this.cdr.detectChanges();
        }
      });
  }
  onSuggestionSelect(selectedItem: any) {
    const itemExists = this.selectedItemList.filter(item => item.value === selectedItem.value);
    const itemSelectionExists = this.selectedValues.filter(item => item.value === selectedItem.value);
    if (itemSelectionExists.length === 0) {
      if (itemExists.length > 0) {
        this.selectedItemList.splice(utils.findIndex(this.selectedItemList, selectedItem), 1);
      }
      this.selectedItemList.splice(itemSelectionExists.length - 1, 0, selectedItem);
      this.selectedValues.push(selectedItem);
      this.scrollHeight = (this.selectedItemList.length > 5) ? '150px' : `${(this.selectedItemList.length * 30) + 30}px`;
      this.onCheckBoxSelect();
    }
    this.autocompleteModel = {};
    this.cdr.detectChanges();
  }
  onCheckBoxSelect() {
    const unSelectedList = this.selectedItemList.filter(item => this.selectedValues.indexOf(item) === -1);
    this.selectedItemList = this.selectedValues.concat(unSelectedList);
    this.itemsSelected.emit(this.selectedValues);
  }
  onReset(emit: boolean = true) {
    this.selectedItemList = [];
    this.selectedValues = [];
    this.scrollHeight = '0';
    this.errorMessage = '';
    if (emit) {
      this.onCheckBoxSelect();
    }
    this.cdr.detectChanges();
  }
  getQuery(searchQuery: string): any {
    let qryToStr = '';
    if (this.filterConfig.query) {
      searchQuery = searchQuery.replace(/[!?:\\[ '^~=\//\\{}&&||<>()+*\]-]/g, '\\\\$&');
      const searchTextQuery = `*${searchQuery}*`;
      qryToStr = JSON.stringify(this.filterConfig.query).replace('search-query-text', searchTextQuery);
    }
    return JSON.parse(qryToStr);
  }
  onClearSuggestion() {
    this.errorMessage = '';
  }

}
