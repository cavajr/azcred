import { Injectable } from "@angular/core";

import { HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { SistemaHttp } from "../../seguranca/sistema-http";
import { Tipo } from "../../core/model";

export class TipoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class TiposService {
  tipoUrl: string;

  constructor(public http: SistemaHttp) {
    this.tipoUrl = `${environment.apiUrl}/tipos`;
  }

  pesquisar(filtro: TipoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.tipoUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const tipos = responseJson.data;
        return {
          tipos,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.tipoUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(tipo: Tipo, tiposSistemas: any): Promise<any> {
    return this.http
      .post<any>(this.tipoUrl, { tipo, tiposSistemas })
      .toPromise()
      .then(response => {
        return response;
      });
  }

  atualizar(tipo: Tipo, tiposSistemas: any): Promise<Tipo> {
    return this.http
      .put<any>(`${this.tipoUrl}/${tipo.id}`, {
        tipo: tipo,
        tiposSistemas: tiposSistemas
      })
      .toPromise()
      .then(response => {
        return response as Tipo;
      });
  }

  buscarPorCodigo(id: number): Promise<Tipo> {
    return this.http
      .get<any>(`${this.tipoUrl}/${id}`)
      .toPromise()
      .then(response => response as Tipo);
  }

  buscarTiposSistemas(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.tipoUrl}/${id}/sistemas`)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  listarAll() {
    return this.http
      .get<any>(`${this.tipoUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
