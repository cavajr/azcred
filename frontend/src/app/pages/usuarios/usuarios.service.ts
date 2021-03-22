import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import { environment } from "./../../../environments/environment";
import { SistemaHttp } from "./../../seguranca/sistema-http";

import { Usuario } from "../../core/model";

export class UsuarioFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class UsuariosService {
  usuariosUrl: string;
  gruposUrl: string;

  constructor(public http: SistemaHttp) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
    this.gruposUrl = `${environment.apiUrl}/grupos/listarAll`;
  }

  pesquisar(filtro: UsuarioFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.usuariosUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const usuarios = responseJson.data;
        return {
          usuarios,
          total: responseJson.total
        };
      });
  }

  listarGrupos(): Promise<any> {
    return this.http
      .get<any>(`${this.gruposUrl}`)
      .toPromise()
      .then(response => response);
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.usuariosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(usuario: Usuario): Promise<Usuario> {
    return this.http
      .post<any>(this.usuariosUrl, usuario)
      .toPromise()
      .then(response => response);
  }

  atualizar(usuario: Usuario): Promise<Usuario> {
    return this.http
      .put<any>(`${this.usuariosUrl}/${usuario.id}`, usuario)
      .toPromise()
      .then(response => response as Usuario);
  }

  buscarPorCodigo(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.usuariosUrl}/${id}`)
      .toPromise()
      .then(response => {
        const respJson = response;
        const usuario = respJson.usuario;
        const papeis = respJson.papeis;
        const resultado = {
          usuario: usuario,
          papeis: papeis
        };
        return resultado;
      });
  }
}
