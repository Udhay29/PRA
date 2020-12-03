import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideComponent } from './aside.component';
import { AsideNavComponent } from './nav/aside-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('AsideComponent', () => {
  let component: AsideComponent;
  let fixture: ComponentFixture<AsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [ AsideComponent, AsideNavComponent ],
      providers: [ HttpClient]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle sidebar', () => {
    component.onToggleSidebarLeft();
    component.isChanging = false;
    component.onToggleSidebarLeft();
    component.isLocked = false;
    component.isOpen = false;
    component.onToggleSidebarLeft();
  });
  it('should lock sidebar', () => {
    component.onLockSidebarLeft();
  });
  it('should return sidebar locked css', () => {
    component.isSidebarLocked();
  });
  it('should toggle app drawer', () => {
    component.onToggleAppDrawer();
  });
});
