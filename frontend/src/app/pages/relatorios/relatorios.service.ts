import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders } from "@angular/common/http";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { environment } from "../../../environments/environment";

import "rxjs/add/operator/map";

import * as moment from "moment";

@Injectable({
  providedIn: "root"
})
export class RelatoriosService {
  relatoriosUrl: string;

  constructor(private http: SistemaHttp) {
    this.relatoriosUrl = `${environment.apiUrl}/relatorios`;
  }

  relatorioRecibos(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.promotor_id) {
      params = params.append("promotor", parametros.promotor_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.relatoriosUrl}/comissao`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  relatorioFinanceiro(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.tipo) {
      params = params.append("tipo", parametros.tipo.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.relatoriosUrl}/financeiro`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  relatorioFisicoPendente(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.promotor_id) {
      params = params.append("promotor", parametros.promotor_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.relatoriosUrl}/fisico-pendente`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  relatorioPagamentos(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.promotor_id) {
      params = params.append("promotor", parametros.promotor_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.relatoriosUrl}/pagamentos`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }
}
