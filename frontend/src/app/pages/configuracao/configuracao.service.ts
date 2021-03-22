import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { AuthService } from "../../seguranca/auth.service";
import { SistemaHttp } from "../../seguranca/sistema-http";

import { environment } from "../../../environments/environment";
import { Config } from "../../core/model";

@Injectable({
  providedIn: "root"
})
export class ConfiguracaoService {
  configUrl: string;

  constructor(public http: SistemaHttp, private auth: AuthService) {
    this.configUrl = `${environment.apiUrl}/config`;
  }

  buscarPorCodigo(id: number): Promise<Config> {
    return this.http
      .get<any>(`${this.configUrl}/${id}`)
      .toPromise()
      .then(response => response as Config);
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
      .post<Config>(`${this.configUrl}/${id}/upload`, formData)
      .toPromise()
      .then(response => response as Config);
  }

  salvar(config: Config): Promise<Config> {
    return this.http
      .put<any>(`${this.configUrl}/${config.id}`, config)
      .toPromise()
      .then(response => response as Config);
  }
}
