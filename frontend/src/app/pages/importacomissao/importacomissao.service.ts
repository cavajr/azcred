import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { AuthService } from "../../seguranca/auth.service";

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ImportacomissaoService {
  configUrl: string;

  constructor(public http: SistemaHttp, private auth: AuthService) {
    this.configUrl = `${environment.apiUrl}/comissao`;
  }

  enviarArquivo(arquivo: File, opcao: any) {
    const headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    headers.append("Accept", "application/json");

    let formData = new FormData();
    formData.append("arquivo", arquivo, arquivo.name);
    formData.append("banco", opcao.banco_id);
    formData.append("convenio", opcao.convenio_id);
    formData.append("tipo", opcao.tipo_id);
    formData.append("sistema", opcao.sistema);
    formData.append("mostrarPor", opcao.mostrarPor);

    if (opcao.sistema === "AMX") {
      return this.http
        .post<any>(`${this.configUrl}/upload-amx`, formData, { headers })
        .toPromise()
        .then(response => {
          console.log(response);
          return response;
        });
    }
  }
}
