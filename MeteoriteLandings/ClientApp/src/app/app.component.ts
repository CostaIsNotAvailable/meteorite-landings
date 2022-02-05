import { Component } from '@angular/core';
import { MeteoriteLanding } from 'src/app/model/data.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Params } from './model/params.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  client: HttpClient;
  baseUrl = environment.BASE_URL;
  displayData: MeteoriteLanding[] = [];
  isCanceled: boolean = false;
  params: {
    continents: string[];
    minMass: number;
    maxMass: number;
    minDate: number;
    maxDate: number;
  } = {
    continents: [],
    minMass: 0,
    maxMass: 100000000,
    minDate: 1400,
    maxDate: 2013,
  };
  actionSnackBar = 'Close';
  optionsSnackBar!: MatSnackBarConfig;

  constructor(http: HttpClient, private _snackBar: MatSnackBar) {
    this.client = http;
    this.optionsSnackBar = new MatSnackBarConfig();
    this.optionsSnackBar.verticalPosition = 'top';
    this.optionsSnackBar.horizontalPosition = 'center';
    this.optionsSnackBar.duration = 4000;
  }

  public async handleFileInput(file: File) {
    try {
      if (file.type != ('application/json' || 'application/yaml') && file) {
        this._snackBar.open(
          'The file type is invalid',
          this.actionSnackBar,
          this.optionsSnackBar
        );
      } else {
        console.log(file);

        const requestBody = new FormData();
        requestBody.append('', file, file.name);
        const requestParams = new HttpParams()
          .append('minMass', this.params.minMass)
          .append('maxMass', this.params.maxMass)
          .append('minDate', this.params.minDate)
          .append('maxDate', this.params.maxDate)
          .append('continents', JSON.stringify(this.params.continents));

        const request = await this.client
          .post<MeteoriteLanding[]>(
            this.baseUrl + '/meteoritelandings',
            requestBody,
            { params: requestParams }
          )
          .toPromise();
        if (request) {
          this.displayData = request;
        }
      }
    } catch (e) {
      this._snackBar.open(
        (e as Error).message,
        this.actionSnackBar,
        this.optionsSnackBar
      );
    }
  }

  public sendToBack(params: Params) {
    this.params.continents = params.continents;
    this.params.minMass = params.minMass;
    this.params.maxMass = params.maxMass;
    this.params.minDate = params.minDate;
    this.params.maxDate = params.maxDate;
    this.handleFileInput(params.file);
  }

  public cancelEvent(isCanceled: boolean) {
    this.isCanceled = isCanceled;
  }
}
