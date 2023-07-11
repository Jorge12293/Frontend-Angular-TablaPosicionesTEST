import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';

const listComponents = [
  FooterComponent,
  NavBarComponent 
];

@NgModule({
  declarations: [
    ...listComponents
  ],
  exports:[
    ...listComponents
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ThemeModule { }
