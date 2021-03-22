import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import { environment } from "./../../../environments/environment";
import { SistemaHttp } from "./../../seguranca/sistema-http";

import { Grupo } from "./../../core/model";

export class GrupoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class GruposService {
  gruposUrl: string;

  constructor(public http: SistemaHttp) {
    this.gruposUrl = `${environment.apiUrl}/grupos`;
  }

  pesquisar(filtro: GrupoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.gruposUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const grupos = responseJson.data;
        return {
          grupos,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.gruposUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(grupo: Grupo): Promise<Grupo> {
    return this.http
      .post<any>(this.gruposUrl, grupo)
      .toPromise()
      .then(response => response);
  }

  atualizar(grupo: Grupo): Promise<Grupo> {
    return this.http
      .put<any>(`${this.gruposUrl}/${grupo.id}`, grupo)
      .toPromise()
      .then(response => response as Grupo);
  }

  buscarPorCodigo(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.gruposUrl}/${id}`)
      .toPromise()
      .then(response => {
        const respJson = response;
        const grupo = respJson.grupo;
        const permissoes = respJson.permissoes;
        const resultado = {
          grupo: grupo,
          permissoes: permissoes
        };
        return resultado;
      });
  }
}
