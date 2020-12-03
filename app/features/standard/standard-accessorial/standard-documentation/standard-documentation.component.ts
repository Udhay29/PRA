import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-standard-documentation',
  templateUrl: './standard-documentation.component.html',
  styleUrls: ['./standard-documentation.component.scss']
})
export class StandardDocumentationComponent {

  constructor( private readonly router: Router) { }
  onCreateDocumentation() {
    this.router.navigateByUrl('/standard/documentation');
  }
}
