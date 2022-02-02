import { Component, Inject } from '@angular/core';
import { Data } from 'src/app/model/data.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  client: HttpClient;
  baseUrl: string; 
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string){
    this.client = http;
    this.baseUrl = baseUrl;
  }
  fileToUpload: File | null = null;
  displayData: Data;
  public handlerFileInput(file: File) {
    this.fileToUpload = file;
    if (this.fileToUpload[0].type != ('application/json' || 'application/yaml') && this.fileToUpload[0]) {
      console.log("ERROR TYPE") // TODO Manage error {Snackbar}
    } else {
      console.log(this.fileToUpload);
      let postData = {
        params: {},
        file: this.displayData
      }
      this.client.post<Data>(this.baseUrl+'/meteoritelandings', {postData}).subscribe(result => {
        this.displayData = result;
      }, error => console.error(error)); // TODO Manage error {Snackbar}
    }
  }
  public sendToBack(event){
    console.log("EVENT",event);
  }
}
