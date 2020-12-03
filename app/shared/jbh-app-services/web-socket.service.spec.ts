import { TestBed, inject } from '@angular/core/testing';
import { WebSocketService } from './web-socket.service';
import { configureTestSuite } from 'ng-bullet';

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  let configInterface;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });
  });

  beforeEach(() => {
    webSocketService = TestBed.get(WebSocketService);
    configInterface = {
      host: 'jbh',
      headers: {},
      heartbeatIn: 89,
      heartbeatOut: 55,
      debug: true,
      reconnectionTimeout: 100,
      queue: {},
      queueCheckTimeMs: 99
    };
    webSocketService.status = 'CLOSED';
    webSocketService.queuePromises = [{
      name: 'jbh'
    }];
    webSocketService.stomp = {
      subscribe: () => ({}),
      send: () => ({}),
      disconnect: () => ({})
    };
  });

  it('should created', () => {
    expect(webSocketService).toBeTruthy();
  });

  it('should call configure', () => {
    webSocketService.configure(configInterface);
    expect(webSocketService.config).toEqual(configInterface);
  });
  it('should call startConnect config not null', () => {
    webSocketService.config = configInterface;
    webSocketService.status = 'CONNECTING';
    webSocketService.startConnect();
  });
  it('should call subscribe', () => {
    const destination = 'jbh';
    const callback = {};
    const headers = new Object();
    webSocketService.subscribe(destination, callback, headers);
    spyOn(webSocketService.stomp, 'subscribe').and.returnValue('updated');
  });

  it('should call unsubscribe', () => {
    const subscription = {
      unsubscribe: () => ({ })
    };
    webSocketService.unsubscribe(subscription);
  });

  it('should call send', () => {
    const destination = 'jbh';
    const body = {};
    const headers = new Object();
    webSocketService.send(destination, body, headers);
  });

  it('should call disconnectStomp', () => {
    webSocketService.disconnect();
  });
});
