import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";

import { environment } from "../../../environments/environment";

import "rxjs/add/operator/map";

import * as moment from "moment";

export class CorretorProducaoFiltro {
  de: Date;
  ate: Date;
  cpf: string;
  cliente: number;
  corretor: number;
  fisico_pendente: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class CorretoresProducoesService {
  producoesUrl: string;

  constructor(public http: SistemaHttp) {
    this.producoesUrl = `${environment.apiUrl}/corretores/producoes`;
  }

  pesquisar(filtro: CorretorProducaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.de) {
      params = params.append("inicio", moment(filtro.de).format("YYYY-MM-DD"));
    }

    if (filtro.ate) {
      params = params.append("fim", moment(filtro.ate).format("YYYY-MM-DD"));
    }

    if (filtro.cpf) {
      params = params.append("cpf", filtro.cpf.toString());
    }

    if (filtro.cliente) {
      params = params.append("cliente", filtro.cliente.toString());
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    if (filtro.fisico_pendente) {
      params = params.append(
        "fisico_pendente",
        filtro.fisico_pendente.toString()
      );
    }

    return this.http
      .get<any>(`${this.producoesUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const producoes = responseJson.data;
        return {
          producoes,
          total: responseJson.total
        };
      });
  }

  exportar(filtro: CorretorProducaoFiltro) {
    let params = new HttpParams({});

    if (filtro.de) {
      params = params.append("inicio", moment(filtro.de).format("YYYY-MM-DD"));
    }

    if (filtro.ate) {
      params = params.append("fim", moment(filtro.ate).format("YYYY-MM-DD"));
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.producoesUrl}/exportar`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }
}
