import { FormGroup } from '@angular/forms';

import { RuleTypeInterface, DayOfWeek, SpecificDaysInterface, MonthlyTypes
} from '../../../../../standard/standard-accessorial/standard-rules/create-rules/model/standard-create-rules.interface';

export class AveragingRulesModel {
    isSubscribeFlag: boolean;
    isMonthly: boolean;
    isWeekly: boolean;
    isEachDay: boolean;
    isOnTheDay: boolean;
    selectedValue: number;
    averagingForm: FormGroup;
    selectedDayOfWeek: DayOfWeek;
    selectedTimeFrame: RuleTypeInterface;
    averageTimeFrame: RuleTypeInterface[];
    averageTimeFrameFiltered: RuleTypeInterface[];
    dayOfWeek: DayOfWeek[];
    dayOfWeekValues: DayOfWeek[];
    frequency: RuleTypeInterface[];
    frequencyValues: RuleTypeInterface[];
    frequencysubType: RuleTypeInterface[];
    frequencysubTypeValues: RuleTypeInterface[];
    specificDay: SpecificDaysInterface[];
    specificDayValue: SpecificDaysInterface[];
    monthlyAveragingTypes: MonthlyTypes[];
    dayOfWeekList: string[];

    constructor() {
        this.isSubscribeFlag = true;
        this.selectedValue = 1;
        this.monthlyAveragingTypes = [{
            label: 'Each',
            value: 1
        }, {
            label: 'On the',
            value: 2
        }];
        this.dayOfWeekList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
}
