import { ShoppingListComponent } from './shopping-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [{ path: '', component: ShoppingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingListRoutingModule {}
