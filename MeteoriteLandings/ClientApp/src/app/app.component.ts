import { Component } from '@angular/core';
import { MeteoriteLanding } from 'src/app/model/data.model';
import { HttpClient } from '@angular/common/http';
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
  params: { continents: string[]; mass: number } = {
    continents: [],
    mass: 0,
  };

  //displayData: Data;
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

        const request = await this.client
          .post<MeteoriteLanding[]>(this.baseUrl + '/meteoritelandings', requestBody)
          .toPromise();

          console.log(request);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  }

  public sendToBack(params: Params) {
    console.log('EMIT PARAMS', params);
      this.handleFileInput(params.file);
  }
}
