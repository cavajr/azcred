import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import "rxjs/add/operator/toPromise";
import { SistemaHttp } from "../../seguranca/sistema-http";
import { Convenio } from "../../core/model";

import { environment } from "../../../environments/environment";

export class ConvenioFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class ConvenioService {
  conveniosUrl: string;

  constructor(public http: SistemaHttp) {
    this.conveniosUrl = `${environment.apiUrl}/convenios`;
  }

  pesquisar(filtro: ConvenioFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.conveniosUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const convenios = responseJson.data;
        return {
          convenios,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.conveniosUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(convenio: Convenio): Promise<Convenio> {
    return this.http
      .post<any>(this.conveniosUrl, convenio)
      .toPromise()
      .then(response => response);
  }

  atualizar(convenio: Convenio): Promise<Convenio> {
    return this.http
      .put<any>(`${this.conveniosUrl}/${convenio.id}`, convenio)
      .toPromise()
      .then(response => response as Convenio);
  }

  buscarPorCodigo(id: number): Promise<Convenio> {
    return this.http
      .get<any>(`${this.conveniosUrl}/${id}`)
      .toPromise()
      .then(response => response as Convenio);
  }

  listarAll() {
    return this.http
      .get<any>(`${this.conveniosUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }
}
