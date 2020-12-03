import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AsideNavComponent } from './aside-nav.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('AsideNavComponent', () => {
  let component: AsideNavComponent;
  let fixture: ComponentFixture<AsideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
       ],
      declarations: [ AsideNavComponent ],
      providers: [ HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cal getRouteIcon', () => {
    component.getRouteIcon({});
  });
});
