import { EventEmitter, Injectable, Output } from '@angular/core';
import { SuperCall } from 'typescript';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

interface Config {
    host: string;
    // optional headers
    headers?: Object;
    // heartbeats (ms)
    heartbeatIn?: number;
    heartbeatOut?: number;
    // debuging
    debug?: boolean;
    // reconnection time (ms)
    recTimeout?: number;
    // queue object
    queue?: any;
    // queue cheking Time (ms)
    queueCheckTime?: number;
    maxRetryCount?: number;
}

@Injectable()
export class WebSocketService {

    config = null;
    stomp: any;
    status: string;
    queuePromises = [];
    private maxRetryCount = 10;
    private retryCount = 0;
    private socket: any;
    private timer: any;
    private readonly disconnectPromise: any;
    private resolveConPromise: (...args: any[]) => void;
    private resolveDisConPromise: (...args: any[]) => void;
    private readonly connectionStatus = new BehaviorSubject('') ;

    constructor() {
        this.status = 'CLOSED';
        this.saveConnectionStatus(this.status);
        // Create promise
        this.disconnectPromise = new Promise(
            (resolve, reject) => this.resolveDisConPromise = resolve
        );
    }

    /**
     * Configure
     */
    configure(config: Config): void {
        this.config = config;
        if (config.maxRetryCount || config.maxRetryCount === 0) {
            this.maxRetryCount = config.maxRetryCount;
        }
    }

    /**
     * Try to establish connection to server
     */
    startConnect(): Promise<{}> {
        if (this.config === null) {
            throw Error('Configuration required!');
        }

        this.status = 'CONNECTING';
        this.saveConnectionStatus(this.status);
        // Prepare Client
        this.socket = new SockJS(this.config.host, null, {
            transports: ['websocket']
        });
        this.stomp = Stomp.over(this.socket);

        this.stomp.heartbeat.outgoing = this.config.heartbeatOut || 60000;
        this.stomp.heartbeat.incoming = this.config.heartbeatIn || 60000;

        // Debuging connection
        if (this.config.debug) {
            this.stomp.debug = function(str) {
                console.log(str);
            };
        } else {
            this.stomp.debug = false;
        }

        // Connect to server
        this.stomp.connect(this.config.headers || {}, this.onConnect, this.onError);
        return new Promise(
            (resolve, reject) => this.resolveConPromise = resolve
        );
    }

    /**
     * Successfull connection to server
     */
    onConnect = (frame: any) => {
        this.retryCount = 0;
        this.status = 'CONNECTED';
        this.saveConnectionStatus(this.status);
        this.resolveConPromise();
        this.timer = null;
    }

    /**
     * Unsuccessfull connection to server
     */
    onError = (error: string ) => {
        // Check error and try reconnect
        if (error && typeof error === 'string' && error.indexOf('Lost connection') !== -1) {
            if (this.config.debug) {
                console.log('Reconnecting...');
            }
            this.timer = setTimeout(() => {
                if (this.retryCount < this.maxRetryCount) {
                    this.retryCount += 1;
                    this.startConnect();
                }
            }, this.config.recTimeout || 5000);
        }
    }

    /**
     * Subscribe
     */
    subscribe(destination: string, callback: any, headers?: Object) {
        headers = headers || {};
        return this.stomp.subscribe(destination, function(response) {
          console.log(response);
            let message = response.body;
            const responseHeaders = response.headers;
            try {
                message = JSON.parse(response.body);
                console.log(message);
            } catch (error) {}
            callback(message, responseHeaders);
        }, headers);
    }

    /**
     * Unsubscribe
     */
    unsubscribe (subscription: any) {
        subscription.unsubscribe();
    }

    /**
     * Send
     */
    send(destination: string, body: any, headers?: Object): void {
        const message = JSON.stringify(body);
        headers = headers || {};
        this.stomp.send(destination, headers, message);
    }

    /**
     * Disconnect stomp
     */
    disconnect(): Promise<{}> {
        this.stomp.disconnect(() => {
            this.resolveDisConPromise();
            this.status = 'CLOSED';
            this.saveConnectionStatus(this.status);
        });
        return this.disconnectPromise;
    }

    /**
     * After specified subscription
     */
    after(name: string): Promise<{}> {
        this.nameCheck(name);
        if (this.config.debug) {
            console.log(`'checking ' ${name} ' queue ...'`);
        }
        const checkQueue = setInterval(() => {
            if (this.config.queue[name]) {
                clearInterval(checkQueue);
                this.queuePromises[name]();
                if (this.config.debug) {
                    console.log(`'queue ' ${name} ' <<< has been complated'`);
                }
                return false;
            }
        }, this.config.queueCheckTime || 100);

        if (!this.queuePromises[name + 'promice']) {
            this.queuePromises[name + 'promice'] = new Promise(
                (resolve, reject) => this.queuePromises[name] = resolve
            );
        }
        return this.queuePromises[name + 'promice'];
    }

    /**
     * Done specified subscription
     */
    done(name: string): void {
        this.nameCheck(name);
        this.config.queue[name] = true;
    }

    /**
     * Turn specified subscription on pending mode
     */
    pending(name: string): void {
        this.nameCheck(name);
        this.config.queue[name] = false;
        if (this.config.debug) {
            console.log(`'queue '  ${name} ' <<<<<<  turned on pending mode'`);
        }
    }

    getConnectionStatus (): any {
        return this.connectionStatus.asObservable();
    }

    /**
     * Check name in queue
     */
    private nameCheck(name: string): void {
        if (!this.config.queue.hasOwnProperty(name)) {
            throw Error(`'\''  ${name} '\' has not found in queue'`);
        }
    }
    private saveConnectionStatus (status): void {
        this.connectionStatus.next(status);
    }
}
