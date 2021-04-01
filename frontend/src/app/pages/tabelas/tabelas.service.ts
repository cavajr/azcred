import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders } from "@angular/common/http";

import { environment } from "../../../environments/environment";
import { SistemaHttp } from "../../seguranca/sistema-http";

import "rxjs/add/operator/map";

export class TabelaFiltro {
  banco_id: number;
  convenio_id: number;
  tipo_id: number;
  perfil_id: number;
  tabela: string;
  prazo: string;
}

@Injectable({
  providedIn: "root"
})
export class TabelasService {
  tabelaUrl: string;

  constructor(public http: SistemaHttp) {
    this.tabelaUrl = `${environment.apiUrl}/tabelas`;
  }

  pesquisar(filtro: TabelaFiltro): Promise<any> {
    let params = new HttpParams({});

    if (filtro.banco_id) {
      params = params.append("banco", filtro.banco_id.toString());
    }

    if (filtro.convenio_id) {
      params = params.append("convenio", filtro.convenio_id.toString());
    }

    if (filtro.tipo_id) {
      params = params.append("tipo", filtro.tipo_id.toString());
    }

    if (filtro.perfil_id) {
      params = params.append("perfil", filtro.perfil_id.toString());
    }

    if (filtro.tabela) {
      params = params.append("tabela", filtro.tabela);
    }

    if (filtro.prazo) {
      params = params.append("prazo", filtro.prazo);
    }

    return this.http
      .get<any>(`${this.tabelaUrl}`, { params })
      .toPromise()
      .then(response => {
        return response;
      });
  }

  exportar(filtro: TabelaFiltro) {
    let params = new HttpParams({});

    if (filtro.banco_id) {
      params = params.append("banco", filtro.banco_id.toString());
    }

    if (filtro.convenio_id) {
      params = params.append("convenio", filtro.convenio_id.toString());
    }

    if (filtro.tipo_id) {
      params = params.append("tipo", filtro.tipo_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.tabelaUrl}/exportar`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }
}
