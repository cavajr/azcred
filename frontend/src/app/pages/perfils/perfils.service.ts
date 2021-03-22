import { Injectable } from "@angular/core";

import { HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { SistemaHttp } from "../../seguranca/sistema-http";
import { Perfil } from "../../core/model";

export class PerfilFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class PerfilsService {
  perfilsUrl: string;

  constructor(public http: SistemaHttp) {
    this.perfilsUrl = `${environment.apiUrl}/perfil`;
  }

  pesquisar(filtro: PerfilFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.perfilsUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const perfils = responseJson.data;
        return {
          perfils,
          total: responseJson.total
        };
      });
  }

  adicionar(perfil: Perfil): Promise<any> {
    return this.http
      .post<any>(this.perfilsUrl, perfil)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  atualizar(perfil: Perfil, comissoes: any): Promise<Perfil> {
    return this.http
      .put<any>(`${this.perfilsUrl}/${perfil.id}`, {
        perfil: perfil,
        comissoes: comissoes
      })
      .toPromise()
      .then(response => {
        return response as Perfil;
      });
  }

  buscarPorCodigo(id: number): Promise<Perfil> {
    return this.http
      .get<any>(`${this.perfilsUrl}/${id}`)
      .toPromise()
      .then(response => response as Perfil);
  }

  buscarPerfilComissao(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.perfilsUrl}/${id}/comissoes`)
      .toPromise()
      .then(response => {
        const perfilsComissoes = response.perfilsComissoes;
        const media = response.media;
        return {
          perfilsComissoes,
          media
        };
      });
  }

  listarAll() {
    return this.http
      .get<any>(`${this.perfilsUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
