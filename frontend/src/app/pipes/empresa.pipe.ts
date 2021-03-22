import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "./../../environments/environment";

@Pipe({
  name: "empresa"
})
export class EmpresaPipe implements PipeTransform {
  profileUrl: string;

  constructor() {
    this.profileUrl = `${environment.url}`;
  }

  transform(img: string): any {
    let url: string;
    if (img === undefined || img === null) {
      url = this.profileUrl + "/storage/empresa/logo.jpeg";
    } else {
      url = this.profileUrl + "/storage/";
      url += img;
    }

    return url;
  }
}
