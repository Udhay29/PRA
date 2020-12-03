import { Breadcrumb } from '../../model/breadcrumb';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';

export class SettingsModel {
  breadCrumbList: Breadcrumb[];
  items: MenuItem[];
  activeIndex: number;
  originTypeList: any[];
  IBUsList: any[];
  selectedIndex: number;
  lastSelectedIndex: number;
  isChangesSaving: boolean;
  isPopupVisible: boolean;
  isSubscribe: boolean;
  popupMessage: string;
  routingUrl: string;
  lastEditedFormFlag: boolean;
  constructor(private readonly messageService: MessageService) {
    this.activeIndex = 1;
    this.isSubscribe = true;
    this.selectedIndex = 0;
    this.breadCrumbList = [
      { label: 'Pricing', routerLink: ['/managereferences'] },
      { label: 'Settings', routerLink: ['/settings'] }
    ];
    this.IBUsList = [
      {
        'code': 'JBI',
        'description': 'JBI'
      },
      {
        'code': 'JBT',
        'description': 'JBT'
      },
      {
        'code': 'ICS',
        'description': 'ICS'
      },
      {
        'code': 'DCS',
        'description': 'DCS'
      }
    ];
    this.originTypeList = [
      {
        'code': 'ramp',
        'description': 'Ramp'
      },
      {
        'code': 'yard',
        'description': 'Yard'
      },
      {
        'code': 'citystate',
        'description': 'City state'
      },
      {
        'code': 'country',
        'description': 'Country'
      },
      {
        'code': 'state',
        'description': 'State'
      },
      {
        'code': '2zip',
        'description': '2-zip'
      },
      {
        'code': '3zip',
        'description': '3-zip'
      },
      {
        'code': '5zip',
        'description': '5-zip'
      },
      {
        'code': '6zip',
        'description': '6-zip'
      },
      {
        'code': '9zip',
        'description': '9-zip'
      },
      {
        'code': '2ziprange',
        'description': '2-zip range'
      },
      {
        'code': '3ziprange',
        'description': '3-zip range'
      },
      {
        'code': '5ziprange',
        'description': '5-zip range'
      },
      {
        'code': '6ziprange',
        'description': '6-zip range'
      },
      {
        'code': 'addr',
        'description': 'Address'
      },
    ];
  }
}
