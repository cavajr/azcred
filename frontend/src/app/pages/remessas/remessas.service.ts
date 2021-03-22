import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";

import { environment } from "../../../environments/environment";

import * as moment from "moment";

export class RemessaFiltro {
  corretor: number;
  status: number;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class RemessasService {
  remessaUrl: string;
  statusUrl: string;
  constructor(public http: SistemaHttp) {
    this.remessaUrl = `${environment.apiUrl}/remessas`;
    this.statusUrl = `${environment.apiUrl}/status`;
  }

  pesquisar(filtro: RemessaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.status) {
      params = params.append("status", filtro.status.toString());
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    return this.http
      .get<any>(`${this.remessaUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const remessas = responseJson.data;
        return {
          remessas,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.remessaUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  buscarPorCodigo(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.remessaUrl}/${id}`)
      .toPromise()
      .then(response => {
        return {
          remessa: response.remessa,
          remessa_item: response.remessa_item
        };
      });
  }

  receber(id, selecionados) {
    return this.http
      .put<any>(`${this.remessaUrl}/${id}/receber`, { selecionados })
      .toPromise()
      .then(response => response);
  }

  relatorioRemessa(parametros) {
    let params = new HttpParams({});

    if (parametros.lote) {
      params = params.append("lote", parametros.lote);
    }

    if (parametros.promotor) {
      params = params.append("promotor", parametros.promotor);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.remessaUrl}/imprimirRemessa`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  relatorioRemessaSelecionado(parametros) {
    let params = new HttpParams({});

    if (parametros.lote) {
      params = params.append("lote", parametros.lote);
    }

    if (parametros.promotor) {
      params = params.append("promotor", parametros.promotor);
    }

    if (parametros.selecionados) {
      params = params.append("selecionados", parametros.selecionados);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.remessaUrl}/imprimirRemessaSelecionado`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  listarStatus() {
    return this.http
      .get<any>(`${this.statusUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
