import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "./../../seguranca/sistema-http";
import { Financeiro } from "./../../core/model";

import { environment } from "./../../../environments/environment";

import * as moment from "moment";

export class FinanceiroFiltro {
  nome: string;
  data_mov: Date;
  tipo: number;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class FinanceiroService {
  fincanceiroUrl: string;

  constructor(public http: SistemaHttp) {
    this.fincanceiroUrl = `${environment.apiUrl}/financeiro`;
  }

  pesquisar(filtro: FinanceiroFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.data_mov) {
      params = params.append(
        "data_mov",
        moment(filtro.data_mov).format("YYYY-MM-DD")
      );
    }

    if (filtro.tipo) {
      params = params.append("tipo", filtro.tipo.toString());
    }

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }

    return this.http
      .get<any>(`${this.fincanceiroUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const financeiros = responseJson.data;
        return {
          financeiros,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.fincanceiroUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(financeiro: Financeiro): Promise<Financeiro> {
    return this.http
      .post<any>(this.fincanceiroUrl, financeiro)
      .toPromise()
      .then(response => response);
  }

  atualizar(financeiro: Financeiro): Promise<Financeiro> {
    return this.http
      .put<any>(`${this.fincanceiroUrl}/${financeiro.id}`, financeiro)
      .toPromise()
      .then(response => response as Financeiro);
  }

  buscarPorCodigo(id: number): Promise<Financeiro> {
    return this.http
      .get<any>(`${this.fincanceiroUrl}/${id}`)
      .toPromise()
      .then(response => response as Financeiro);
  }
}
