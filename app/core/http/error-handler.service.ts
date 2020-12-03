import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class ErrorHandlerService {

    private readonly errors = new Subject<string[]>();

    constructor(private readonly messageService: MessageService) { }

    public addErrors = (errors: any): void => {
        if (errors.length > 0) {
            this.messageService.clear();
            this.messageService.add({ severity: 'error', summary: `${errors[0]['statusText']}`, detail: `${errors[0]['message']}` });
        }
    }

    public getErrors = () =>
        this.errors.asObservable()
}
