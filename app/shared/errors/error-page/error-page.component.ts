import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html'
})

export class ErrorPageComponent implements OnInit {
  status: number;

  constructor(private readonly route: ActivatedRoute) {
    this.status = 401;
  }

  ngOnInit() {
    this.status = this.route.snapshot.params.status;
    console.log('Status', this.status);
  }

}
