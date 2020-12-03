import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from '../../app.module';
import { UserService } from './user.service';
import { configureTestSuite } from 'ng-bullet';

describe('UserService', () => {
  let userService: UserService;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppModule],
      declarations: [],
      providers: [UserService, { provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });
  beforeEach(() => {
    userService = TestBed.get(UserService);
    userService.userDetails = { userId: '6' };
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

  it('should call hasAccess operation R', () => {
    userService.userDetails = { userId: '6', urlAccessList: [] };
    const url = '';
    const operation = 'R';
    userService.hasAccess(url, operation);
  });

  it('should call hasAccess operation PU', () => {
    userService.userDetails = { userId: '6', urlAccessList: [
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 2 },
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 3 }
    ] };
    const url = 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj';
    const operation = 'PU';
    userService.hasAccess(url, operation);
  });

  it('should call hasAccess operation FU', () => {
    userService.userDetails = { userId: '6', urlAccessList: [
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 3 },
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 4 }
    ] };
    const url = 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj';
    const operation = 'FU';
    userService.hasAccess(url, operation);
  });

  it('should call hasAccess operation C', () => {
    userService.userDetails = { userId: '6', urlAccessList: [
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 3 },
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 4 }
    ] };
    const url = 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj';
    const operation = 'C';
    userService.hasAccess(url, operation);
  });
  it('should call hasPowerAccess operation R', () => {
    userService.userDetails = { urlAccessList: [
      { uri: '/.*', accessLevel: 3 },
      { uri: '/.*', accessLevel: 4 }
    ] };
    const operation = 'R';
    userService.hasPowerAccess(operation);
  });

  it('should call hasPowerAccess operation PU', () => {
    userService.userDetails = { urlAccessList: [
      { uri: '/.*', accessLevel: 3 },
      { uri: '/.*', accessLevel: 4 }
    ] };
    const operation = 'PU';
    userService.hasPowerAccess(operation);
  });

  it('should call hasPowerAccess operation D', () => {
    userService.userDetails = { urlAccessList: [
      { uri: '/.*', accessLevel: 3 },
      { uri: '/.*', accessLevel: 4 }
    ] };
    const operation = 'D';
    userService.hasPowerAccess(operation);
  });

  it('should call hasPowerAccess return false', () => {
    userService.userDetails = { urlAccessList: [] };
    const operation = 'R';
    userService.hasPowerAccess(operation);
  });

  it('should call getDetails', () => {
    userService.getDetails();
  });

  it('should call getUserId', () => {
    userService.getUserId();
  });

  it('should call getAuthenticationStatus return 200', () => {
    userService.userDetails = { urlAccessList: [
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 3 },
      { uri: 'http://testtest.com?kahksd;jsessionid=56?jaljsdflkj', accessLevel: 4 }
    ] };
    userService.getAuthenticationStatus();
  });

  it('should call getAuthenticationStatus return status', () => {
    userService.userDetails = { urlAccessList: [] };
    userService.getAuthenticationStatus();
  });

  it('should call getUserLang', () => {
    userService.getUserLang();
  });
});
