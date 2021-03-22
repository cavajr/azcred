import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";
import { Sistema } from "../../core/model";

import { environment } from "../../../environments/environment";

export class SistemaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class SistemasService {
  sistemasUrl: string;

  constructor(public http: SistemaHttp) {
    this.sistemasUrl = `${environment.apiUrl}/sistemas`;
  }

  pesquisar(filtro: SistemaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }

    return this.http
      .get<any>(`${this.sistemasUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const sistemas = responseJson.data;
        return {
          sistemas,
          total: responseJson.total
        };
      });
  }

  adicionar(sistema: Sistema): Promise<Sistema> {
    return this.http
      .post<any>(this.sistemasUrl, sistema)
      .toPromise()
      .then(response => response.data);
  }

  atualizar(sistema: Sistema): Promise<Sistema> {
    return this.http
      .put<any>(`${this.sistemasUrl}/${sistema.id}`, sistema)
      .toPromise()
      .then(response => response.data as Sistema);
  }

  buscarPorCodigo(id: number): Promise<Sistema> {
    return this.http
      .get<any>(`${this.sistemasUrl}/${id}`)
      .toPromise()
      .then(response => response.data as Sistema);
  }

  listarAll() {
    return this.http
      .get<any>(`${this.sistemasUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
