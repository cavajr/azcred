import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { Bancopg } from "../../core/model";

import { environment } from "../../../environments/environment";

export class BancopgFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class BancospgService {
  bancospgUrl: string;

  constructor(public http: SistemaHttp) {
    this.bancospgUrl = `${environment.apiUrl}/bancospg`;
  }

  pesquisar(filtro: BancopgFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.bancospgUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const bancospg = responseJson.data;
        return {
          bancospg,
          total: responseJson.total,
          itensPorPagina: responseJson.per_page
        };
      });
  }

  adicionar(bancopg: Bancopg): Promise<Bancopg> {
    return this.http
      .post<any>(this.bancospgUrl, bancopg)
      .toPromise()
      .then(response => response);
  }

  atualizar(bancopg: Bancopg): Promise<Bancopg> {
    return this.http
      .put<any>(`${this.bancospgUrl}/${bancopg.id}`, bancopg)
      .toPromise()
      .then(response => response as Bancopg);
  }

  buscarPorCodigo(id: number): Promise<Bancopg> {
    return this.http
      .get<any>(`${this.bancospgUrl}/${id}`)
      .toPromise()
      .then(response => response as Bancopg);
  }

  listarAll() {
    return this.http
      .get<any>(`${this.bancospgUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
