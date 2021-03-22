import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { Acesso } from "../../core/model";

import { environment } from "../../../environments/environment";

export class AcessoFiltro {
  banco: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class AcessosService {
  acessosUrl: string;

  constructor(public http: SistemaHttp) {
    this.acessosUrl = `${environment.apiUrl}/acessos`;
  }

  pesquisar(filtro: AcessoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.banco) {
      params = params.append("banco", filtro.banco);
    }

    return this.http
      .get<any>(`${this.acessosUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const acessos = responseJson.data;
        return {
          acessos,
          total: responseJson.total
        };
      });
  }

  adicionar(acesso: Acesso): Promise<Acesso> {
    return this.http
      .post<any>(this.acessosUrl, acesso)
      .toPromise()
      .then(response => response.data);
  }

  atualizar(acesso: Acesso): Promise<Acesso> {
    return this.http
      .put<any>(`${this.acessosUrl}/${acesso.id}`, acesso)
      .toPromise()
      .then(response => response.data as Acesso);
  }

  buscarPorCodigo(id: number): Promise<Acesso> {
    return this.http
      .get<any>(`${this.acessosUrl}/${id}`)
      .toPromise()
      .then(response => response.data as Acesso);
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.acessosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  listarAll() {
    return this.http
      .get<any>(`${this.acessosUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
