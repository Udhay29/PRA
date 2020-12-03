import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FuelPriceViewModel } from './model/fuel-price-view.model';
import { FuelPriceViewService } from './service/fuel-price-view.service';
import { takeWhile } from 'rxjs/operators';
import { MessageService } from 'primeng/components/common/messageservice';
import * as utils from 'lodash';
import { FuelListDisplay, FuelPriceDetails } from './model/fuel-price-view.interface';

@Component({
  selector: 'app-fuel-price-view',
  templateUrl: './fuel-price-view.component.html',
  styleUrls: ['./fuel-price-view.component.scss']
})
export class FuelPriceViewComponent implements OnInit {
  @Input() fuelProgramId;
  fuelPriceViewModel: FuelPriceViewModel;
  constructor(private readonly fuelPriceViewService: FuelPriceViewService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly messageService: MessageService) {
    this.fuelPriceViewModel = new FuelPriceViewModel();
  }

  ngOnInit() {
    this.fuelPriceDetails();
  }
  fuelPriceDetails() {
    this.fuelPriceViewService.getFuelPriceValues(this.fuelProgramId).pipe(takeWhile(() =>
      this.fuelPriceViewModel.subscriberFlag)).subscribe((response: FuelPriceDetails[]) => {
        if (!utils.isEmpty(response)) {
          this.fuelPriceViewModel.fuelPriceItems = response;
          const regionSetDTO = this.fuelPriceViewModel.fuelPriceItems['fuelPriceBasisRegionSetDTO'];
          if (!utils.isEmpty(regionSetDTO['fuelPriceBasisRegionDTOs'])) {
            regionSetDTO['fuelPriceBasisRegionDTOs'].forEach(data => {
              data.fuelDistrictDTO.fuelNationalDistrictName = data.fuelDistrictDTO.fuelSubDistrictName ?
                data.fuelDistrictDTO.fuelSubDistrictName : data.fuelDistrictDTO.fuelNationalDistrictName;
              this.fuelPriceViewModel.districtDataArray.push(data.fuelDistrictDTO.fuelNationalDistrictName);
            });
            regionSetDTO['fuelPriceBasisRegionDTOs'].forEach(data => {
              this.fuelPriceViewModel.fuelListDisplay.push({
                'region': data.fuelDistrictDTO.fuelNationalDistrictName,
                'regionStateOption': data.isDefinedRegionStates,
                'conditionName': '--',
                'states': data.associatedStates
              });
            });
          }
        }
        this.changeDetector.detectChanges();
      }, (error: Error) => {
        if (error) {
          this.toastMessage(this.messageService, 'error', 'Error', error.message);
        }
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
