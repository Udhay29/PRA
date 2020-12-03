import { Component } from '@angular/core';
import { FuelDetailViewModel } from './model/fuel-detail-view.model';
import { AgreementDetails } from './model/fuel-detail-view.interface';

import { LocalStorageService } from './../../../../shared/jbh-app-services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-fuel-programs-detail-view',
  templateUrl: './fuel-programs-detail-view.component.html',
  styleUrls: ['./fuel-programs-detail-view.component.scss']
})
export class FuelProgramsDetailViewComponent {
  agreementData: AgreementDetails;
  fuelDetailViewModel: FuelDetailViewModel;
  constructor(private readonly localStore: LocalStorageService, private readonly activatedRoute: ActivatedRoute, public route: Router) {
    this.agreementData = this.localStore.getAgreementDetails();
    if (this.agreementData && this.agreementData['customerAgreementID']) {
      this.fuelDetailViewModel = new FuelDetailViewModel(this.agreementData['customerAgreementID']);
    }
    this.activatedRoute.queryParams.subscribe((params) => {
      this.fuelDetailViewModel.fuelProgramID = params['id'];
    });
  }
}
