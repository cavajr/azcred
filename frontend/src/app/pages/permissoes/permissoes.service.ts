import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/toPromise";
import { SistemaHttp } from "../../seguranca/sistema-http";
import { Permissao } from "../../core/model";

import { environment } from "../../../environments/environment";

export class PermissaoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class PermissoesService {
  permissoesUrl: string;

  constructor(public http: SistemaHttp) {
    this.permissoesUrl = `${environment.apiUrl}/permissoes`;
  }

  pesquisar(filtro: PermissaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.permissoesUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const permissoes = responseJson.data;
        return {
          permissoes,
          total: responseJson.total
        };
      });
  }

  listarPermissoes(): Promise<any> {
    return this.http
      .get<any>(`${this.permissoesUrl}/listarPermissoes`)
      .toPromise()
      .then(response => response);
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.permissoesUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(permissao: Permissao): Promise<Permissao> {
    return this.http
      .post<any>(this.permissoesUrl, permissao)
      .toPromise()
      .then(response => response);
  }

  atualizar(permissao: Permissao): Promise<Permissao> {
    return this.http
      .put<any>(`${this.permissoesUrl}/${permissao.id}`, permissao)
      .toPromise()
      .then(response => response as Permissao);
  }

  buscarPorCodigo(id: number): Promise<Permissao> {
    return this.http
      .get<any>(`${this.permissoesUrl}/${id}`)
      .toPromise()
      .then(response => response as Permissao);
  }
}
