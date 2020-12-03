import { Component, OnInit, Input } from '@angular/core';
import { FuelPriceViewService } from '../fuel-price-view/service/fuel-price-view.service';
import { FuelCalculationDetailModel } from './model/fuel-calculation-detail.model';
import { FuelCalculationDetails } from '../fuel-calculation-view/model/fuel-calculation-detail.interface';
import { takeWhile } from 'rxjs/operators';
import { FuelPriceViewModel } from '../fuel-price-view/model/fuel-price-view.model';
import { FuelCalculationViewService } from '../fuel-calculation-view/service/fuel-calculation-view.service';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
  selector: 'app-fuel-calculation-view',
  templateUrl: './fuel-calculation-view.component.html',
  styleUrls: ['./fuel-calculation-view.component.scss']
})
export class FuelCalculationViewComponent implements OnInit {
  @Input() fuelProgramId;
  fuelCalculationDetailModel: FuelCalculationDetailModel;
  fuelPriceViewModel: FuelPriceViewModel;
  constructor(private readonly fuelCalculationViewService: FuelCalculationViewService, private readonly messageService: MessageService) {
    this.fuelCalculationDetailModel = new FuelCalculationDetailModel();
    this.fuelPriceViewModel = new FuelPriceViewModel();
  }

  ngOnInit() {
    this.getFuelCalculationDetails();
  }

  getFuelCalculationDetails() {
    this.fuelCalculationDetailModel.isPageLoading = true;
    this.fuelCalculationViewService.getFuelCalculationDetails(this.fuelProgramId)
      .pipe(takeWhile(() => this.fuelPriceViewModel.subscriberFlag)).subscribe(
        (data: FuelCalculationDetails) => {
          this.fuelCalculationDetailModel.isPageLoading = false;
          this.fuelCalculationDetailModel.fuelCalulationDetails = data;
          this.fuelCalculationDetailModel.chargeType = `${this.fuelCalculationDetailModel.fuelCalulationDetails.
            chargeType.chargeTypeName} (${this.fuelCalculationDetailModel.fuelCalulationDetails.chargeType.chargeTypeCode})`;
        }, (error: Error) => {
          if (error) {
            this.toastMessage(this.messageService, 'error', 'Error', error.message);
          }
          this.fuelCalculationDetailModel.isPageLoading = false;
        });
  }

  toastMessage(messageService: MessageService, key: string, type: string, data: string) {
    const message = {
      severity: key,
      summary: type,
      detail: data
    };
    messageService.clear();
    messageService.add(message);
  }
}
