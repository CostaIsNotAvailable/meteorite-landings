import { Component, Inject } from '@angular/core';
import { Data } from 'src/app/model/data.model';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  client: HttpClient;
  baseUrl = environment.BASE_URL;
  //displayData: Data;
  constructor(http: HttpClient){
    this.client = http;
  }
  fileToUpload: File | null = null;
  public handlerFileInput(file: File) {
    this.fileToUpload = file;
    if (this.fileToUpload.type != ('application/json' || 'application/yaml') && this.fileToUpload) {
      console.log("ERROR TYPE") // TODO Manage error {Snackbar}
    } else {
      console.log(this.fileToUpload);
      let postData = {
        params: {},
        file: "FILE TO IMPORT"
      }
      this.client.post<Data>(this.baseUrl+'/meteoritelandings', {postData}).subscribe(result => {
        console.log(result)
        //this.displayData = result;
      }, error => console.error(error)); // TODO Manage error {Snackbar}
    }
  }
  public sendToBack(event: Event){
    console.log("EVENT",event);
  }
}
