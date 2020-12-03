import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { Table, TableService } from 'primeng/table';
import { PaginatorModule, DomHandler } from 'primeng/primeng';
import { ObjectUtils } from 'primeng/components/utils/objectutils';
import { TableKeynavDirective } from './table-keynav.directive';
describe('TableKeynavDirective', () => {
  let pipe: TableKeynavDirective;

  const trIndex = 0;
  // Double click
  const dblRightKey = 0;
  const dblLeftKey = 0;
  const leftClickSubscribeFlag = true;
  const rightClickSubscribeFlag = true;


  beforeEach(() => {
    const selectedDiv = document.createElement('div');
    const elementRefStub = {
      nativeElement: {
        addEventListener: () => ({}),
        querySelector: () => selectedDiv,
        querySelectorAll: () => ({}),
        removeEventListener: () => ({})
      }
    };
    TestBed.configureTestingModule({
      imports: [PaginatorModule],
      declarations: [TableKeynavDirective],
      providers: [
        TableKeynavDirective, Table, DomHandler, ObjectUtils, TableService,
        { provide: ElementRef, useValue: elementRefStub }
      ]
    });
    pipe = TestBed.get(TableKeynavDirective);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('trIndex defaults to: 1', () => {
    expect(pipe.trIndex).toEqual(1);
  });
  it('dblRightKey defaults to: 0', () => {
    expect(pipe.dblRightKey).toEqual(0);
  });
  it('dblLeftKey defaults to: 0', () => {
    expect(pipe.dblLeftKey).toEqual(0);
  });
  it('leftClickSubscribeFlag defaults to: true', () => {
    expect(pipe.leftClickSubscribeFlag).toEqual(true);
  });
  it('rightClickSubscribeFlag defaults to: true', () => {
    expect(pipe.rightClickSubscribeFlag).toEqual(true);
  });
  it('should call ngAfterViewInit', () => {
    pipe.ngAfterViewInit();
    expect(pipe.ngAfterViewInit).toBeTruthy();
  });
  it('should call setFocusToSearchOrPagination for key p', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      ctrlKey: true, altKey: true,
      code: 'keyp'
    });
    pipe.setFocusToSearchOrPagination(event);
    expect(pipe.setFocusToSearchOrPagination).toBeTruthy();
  });
  it('should call setFocusToSearchOrPagination for the key s', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      code: 'keys'
    });
    pipe.searchElement = document.createElement('input');
    pipe.setFocusToSearchOrPagination(event);
    expect(pipe.setFocusToSearchOrPagination).toBeTruthy();
  });
  it('should call setFocusToSearchOrPagination for the default', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      code: 'keyk'
    });
    pipe.setFocusToSearchOrPagination(event);
    expect(pipe.setFocusToSearchOrPagination).toBeTruthy();
  });
  it('should call setFocusTableElements for the key o', () => {
    pipe.overflowElement = document.createElement('input');
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      code: 'keyo'
    });
    pipe.setFocusTableElements(event);
    expect(pipe.setFocusTableElements).toBeTruthy();
  });
  it('should call setFocusTableElements for the key f', () => {
    pipe.filterElement = document.createElement('input');
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      code: 'keyf'
    });
    pipe.setFocusTableElements(event);
    expect(pipe.setFocusTableElements).toBeTruthy();
  });
  it('should call setFocusTableElements for the key r', () => {
    const event: KeyboardEvent = new KeyboardEvent('keyup', {
      code: 'keyr'
    });
    const table = document.createElement('table');
    const row = document.createElement('tr');
    const row1 = document.createElement('tr');
    table.appendChild(row);
    table.appendChild(row1);
    pipe.allTrs = table.children;
    pipe.setFocusTableElements(event);
    expect(pipe.setFocusTableElements).toBeTruthy();
  });
});
