import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";

import { environment } from "../../../environments/environment";

import { AuthService } from "../../seguranca/auth.service";

@Injectable({
  providedIn: "root"
})
export class ImportaproducaoService {
  configUrl: string;

  constructor(public http: SistemaHttp, private auth: AuthService) {
    this.configUrl = `${environment.apiUrl}/producao`;
  }

  enviarArquivo(arquivo: File, opcao: any) {
    let formData = new FormData();
    formData.append("arquivo", arquivo, arquivo.name);
    formData.append("sistema", opcao.sistema);

    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    if (opcao.sistema === "AMX") {
      return this.http
        .post<any>(`${this.configUrl}/upload-amx`, formData)
        .toPromise()
        .then(response => {
          return response;
        });
    }

    if (opcao.sistema === "CEDIBRA") {
      return this.http
        .post<any>(`${this.configUrl}/upload-cedibra`, formData)
        .toPromise()
        .then(response => {
          return response;
        });
    }

    if (opcao.sistema === "STORM") {
      return this.http
        .post<any>(`${this.configUrl}/upload-storm`, formData)
        .toPromise()
        .then(response => {
          return response;
        });
    }
  }
}
