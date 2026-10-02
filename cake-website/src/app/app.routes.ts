import { Routes } from '@angular/router';
import {ClientComponent} from './components/client/client.component';
import {AdminComponent} from './components/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    component: ClientComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];
