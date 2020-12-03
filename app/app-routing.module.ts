import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocalizationResolver } from './core/i18n/localization.resolver';
import { ErrorPageComponent } from './shared/errors/index';
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: 'app/features/dashboard/dashboard.module#DashboardModule',
    resolve: {
      translationLoaded: LocalizationResolver
    },
    data: {
      createSidebarEntry: true,
      pathDisplayText: 'Pricing Dashboard',
      pathIcon: 'icon-Home',
      order: 2
    }
  }, {
    path: 'searchagreement',
    loadChildren:
      'app/features/search-agreement/search-agreement.module#SearchAgreementModule',
    data: {
      createSidebarEntry: true,
      pathDisplayText: 'Search Agreements',
      title: 'Search Agreements',
      pathIcon: 'icon-Search pull-right',
      order: 2
    }
  }, {
    path:  'viewagreement',
    loadChildren:
      'app/features/view-agreement-details/view-agreement-details.module#ViewAgreementDetailsModule',
    data:  {
      createSidebarEntry: false,
      pathDisplayText:  'View Agreement',
      title: 'Search Agreements',
      pathIcon:  'icon-Circle_Add_Solid pull-right',
      order:  2
    }
  }, {
    path:  'viewcarrierdetails',
    loadChildren:
      'app/features/view-carrier-agreement/view-carrier-agreement.module#ViewCarrierAgreementModule',
    data:  {
      createSidebarEntry: false,
      pathDisplayText:  'View Carrier Agreement',
      title: 'Search Agreements',
      pathIcon:  'icon-Circle_Add_Solid pull-right',
      order:  2
    }
  }, {
    path: 'createagreement',
    loadChildren:
      'app/features/create-agreement/create-agreement.module#CreateAgreementModule',
    data: {
      createSidebarEntry: true,
      pathDisplayText: 'Create Agreement',
      title: 'Create Agreement',
      pathIcon: 'icon-Circle_Add_Solid pull-right',
      order: 2
    }
  }, {
    path: 'standard',
    loadChildren:
    'app/features/standard/standard.module#StandardModule',
    data: {
      createSidebarEntry: true,
      pathDisplayText: 'Standards',
      title: 'Standards',
      pathIcon: 'icon-Document pull-right',
      order: 2
    }
  },
  {
    path: 'settings',
    loadChildren:
      'app/features/settings/settings.module#SettingsModule',
    resolve: {
      translationLoaded: LocalizationResolver
    },
    data: {
      createSidebarEntry: true,
      pathDisplayText: 'Settings',
      title: 'Settings',
      pathIcon: 'icon-Admin',
      order: 2
    }
  },
  {
    path: 'error/:status',
    component: ErrorPageComponent,
    data: {
      title: 'Error',
    }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LocalizationResolver]
})
export class AppRoutingModule { }
