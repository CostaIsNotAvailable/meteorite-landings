import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GlobeComponent } from './globe/globe.component';
import { InterfaceComponent } from './interface/interface.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  imports: [BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
  HttpClientModule,
  FormsModule,
  MatCheckboxModule,
  MatSliderModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatButtonModule,
  MatIconModule,
  MatNativeDateModule,
  RouterModule.forRoot([
      { path: '', component: AppComponent, pathMatch: 'full' }
    ]),
  BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    GlobeComponent,
    InterfaceComponent
  ],
  bootstrap: [AppComponent, GlobeComponent, InterfaceComponent]
})
export class AppModule {}
