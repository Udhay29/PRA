import { Component, Input, Output, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import * as lodashUtils from 'lodash';

@Component({
  selector: 'app-slider-filter',
  templateUrl: './slider-filter.component.html',
  styleUrls: ['./slider-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderFilterComponent implements OnInit, OnDestroy {
  isSliderFilterAccordianOpened = false;
  filterConfig: any;
  @Input() set config(filterData: any) {
    if (filterData) {
      this.filterConfig = filterData;
      this.loadFilterData();
    }
  }

  @Output() slideValue: EventEmitter<number | number[]> = new EventEmitter();

  sliderVal: number | number[];

  min = 0;
  max = 100;
  range = true;
  hideRange = false;
  isPanelClosed = true;

  timerSubscription: Subscription;

  constructor(private readonly cdr: ChangeDetectorRef) {
    this.isSliderFilterAccordianOpened = false;
   }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadFilterData() {
    if (this.filterConfig) {
      this.min = (this.filterConfig.min) ? this.filterConfig.min : 0;
      this.max = (this.filterConfig.max) ? this.filterConfig.max : 100;
      this.range = (this.filterConfig.range === true) ? this.filterConfig.range : false;
      this.hideRange = this.filterConfig.hideRange;
      this.loadSliderValue();
      this.cdr.detectChanges();
    }
  }
  loadSliderValue() {
    if (this.range) {
      this.sliderVal = (this.filterConfig.default && this.filterConfig.default.length === 2) ?
        lodashUtils.slice(this.filterConfig.default) : [this.min, this.max];
    } else {
      this.sliderVal = (this.filterConfig.default) ? this.filterConfig.default : this.min;
    }
  }
  afterPanelToggle(collapsed: boolean) {
    this.isPanelClosed = collapsed;
    this.cdr.detectChanges();
  }
  closePanel() {
    this.afterPanelToggle(true);
  }
  onReset(emit: boolean = true) {
    this.sliderVal = null;
    if (this.range) {
      this.sliderVal = (this.filterConfig.default && this.filterConfig.default.length === 2) ?
        lodashUtils.slice(this.filterConfig.default) : [this.min, this.max];
    } else {
      this.sliderVal = (this.filterConfig.default) ? this.filterConfig.default : this.min;
    }
    if (emit) {
      this.slideValue.emit(this.sliderVal);
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  handleChange(event: any, slider: boolean) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = timer(300).subscribe(() => {
      const value = slider === true ? event.value : event.target.value;
      if (value) {
        this.slideValue.emit(value);
      } else {
        this.slideValue.emit(event.values);
      }
    });
  }
}
