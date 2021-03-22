import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "./../../environments/environment";

@Pipe({
  name: "imagem"
})
export class ImagenPipe implements PipeTransform {
  profileUrl: string;

  constructor() {
    this.profileUrl = `${environment.url}`;
  }

  transform(img: string): any {
    let url: string;
    if (img === undefined || img === null) {
      url = this.profileUrl + "/storage/imagens/default.png";
    } else {
      url = this.profileUrl + "/storage/";
      url += img;
    }

    return url;
  }
}
