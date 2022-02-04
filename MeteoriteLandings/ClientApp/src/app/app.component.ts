import { Component } from '@angular/core';
import { MeteoriteLanding } from 'src/app/model/data.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Params } from './model/params.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  client: HttpClient;
  baseUrl = environment.BASE_URL;
  displayData: MeteoriteLanding[] = [];
  params: { continents: string[]; mass: number } = {
    continents: [],
    mass: 0,
  };

  constructor(http: HttpClient) {
    this.client = http;
  }

  public async handleFileInput(file: File) {
    try {
      if (file.type != ('application/json' || 'application/yaml') && file) {
        console.log('ERROR TYPE'); // TODO Manage error {Snackbar}
      } else {
        console.log(file);

        const requestBody = new FormData();
        requestBody.append('', file, file.name);
        const requestParams = new HttpParams()
          .append('mass', this.params.mass)
          .append('continents', JSON.stringify(this.params.continents));

        const request = await this.client
          .post<MeteoriteLanding[]>(this.baseUrl + '/meteoritelandings', requestBody, { params: requestParams})
          .toPromise();
          if(request){
            this.displayData = request
          }
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  public sendToBack(params: Params) {
    console.log('EMIT PARAMS', params);
    this.params.continents = params.continents;
    this.params.mass = params.mass;
    this.handleFileInput(params.file);
  }
}
