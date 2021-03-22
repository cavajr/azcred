import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { AuthService } from "./../../seguranca/auth.service";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "./../../seguranca/sistema-http";

import { environment } from "./../../../environments/environment";
import { Usuario } from "../../core/model";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  profileUrl: string;

  constructor(public http: SistemaHttp, private auth: AuthService) {
    this.profileUrl = `${environment.apiUrl}/profile`;
  }

  buscarPorCodigo(id: number): Promise<Usuario> {
    return this.http
      .get<any>(`${this.profileUrl}/${id}`)
      .toPromise()
      .then(response => response as Usuario);
  }

  enviarArquivo(archivo: File, id: number) {
    let formData = new FormData();
    formData.append("arquivo", archivo, archivo.name);
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http
      .post<Usuario>(`${this.profileUrl}/${id}/upload`, formData)
      .toPromise()
      .then(response => response as Usuario);
  }
}
