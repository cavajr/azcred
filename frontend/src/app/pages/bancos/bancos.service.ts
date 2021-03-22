import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { Banco } from "../../core/model";

import { environment } from "../../../environments/environment";

export class BancoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class BancosService {
  bancosUrl: string;

  constructor(public http: SistemaHttp) {
    this.bancosUrl = `${environment.apiUrl}/bancos`;
  }

  pesquisar(filtro: BancoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }

    return this.http
      .get<any>(`${this.bancosUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const bancos = responseJson.data;
        return {
          bancos,
          total: responseJson.total
        };
      });
  }

  adicionar(banco: Banco): Promise<Banco> {
    return this.http
      .post<any>(this.bancosUrl, banco)
      .toPromise()
      .then(response => response.data);
  }

  atualizar(banco: Banco): Promise<Banco> {
    return this.http
      .put<any>(`${this.bancosUrl}/${banco.id}`, banco)
      .toPromise()
      .then(response => response.data as Banco);
  }

  buscarPorCodigo(id: number): Promise<Banco> {
    return this.http
      .get<any>(`${this.bancosUrl}/${id}`)
      .toPromise()
      .then(response => response.data as Banco);
  }

  listarAll() {
    return this.http
      .get<any>(`${this.bancosUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
