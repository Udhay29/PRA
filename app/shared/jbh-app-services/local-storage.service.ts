import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private readonly localStore = localStorage;
  private memoryStore = {};
  private store;
  private cargoDefaultAmount;
  private cargoAmount;
  private agreementDetails;
  private lineHaulIds = [];
  private accessorial = [];
  private accessorialRetainTab = false;
  constructor() { }

  getItem(parentName, key, persist?) {
    this.setStorage(persist);
    return this.store[parentName + '_' + key];
  }

  setItem(parentName, key, value, persist?): void {
    this.setStorage(persist);
    this.store[parentName + '_' + key] = value;
  }

  clearItems(persist?): void {
    if (persist) {
      this.localStore.clear();
    } else {
      this.memoryStore = {};
    }
  }
  setAccessorialTab(parentName, key, value) {
    this.accessorial[parentName + '_' + key] = value;
    this.accessorialRetainTab = true;
  }

  getAccessorialTab(parentName, key) {
    return this.accessorial[parentName + '_' + key];
  }
  clearAllItems(): void {
    this.localStore.clear();
    this.memoryStore = {};
  }
  isAccessorialTabRetained(): boolean {
    return this.accessorialRetainTab;
  }
  setAccessorialTabRetained(value: boolean): void {
    this.accessorialRetainTab = value;
  }
  clearItem(parentName, key, persist?): void {
    this.setStorage(persist);
    delete this.store[parentName + '_' + key];
  }
  setCargoAmount(value) {
    this.cargoAmount = value;
  }
  getCargoAmount() {
    return this.cargoAmount;
  }

  setDefaultAmount(value) {
    this.cargoDefaultAmount = value;
  }
  getDefaultAmount() {
    return this.cargoDefaultAmount;
  }
  setAgreementDetails(value) {
    this.agreementDetails = value;
  }
  getAgreementDetails() {
    return this.agreementDetails;
  }
  private setStorage(persist) {
    if (persist) {
      this.store = this.localStore;
    } else {
      this.store = this.memoryStore;
    }
  }
  setLineHaulIds(lineHaulId: number) {
    this.lineHaulIds.push(lineHaulId);
  }
  emptyLineHaulIds() {
    this.lineHaulIds = [];
  }
  getLineHaulIds() {
    return this.lineHaulIds;
  }
}
