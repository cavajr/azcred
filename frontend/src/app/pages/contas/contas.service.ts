import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import { environment } from "./../../../environments/environment";
import { SistemaHttp } from "./../../seguranca/sistema-http";

import { Conta } from "./../../core/model";

export class ContaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: "root"
})
export class ContasService {
  contasUrl: string;

  constructor(public http: SistemaHttp) {
    this.contasUrl = `${environment.apiUrl}/contas`;
  }

  pesquisar(filtro: ContaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.contasUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const contas = responseJson.data;
        return {
          contas,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.contasUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(conta: Conta): Promise<Conta> {
    return this.http
      .post<any>(this.contasUrl, conta)
      .toPromise()
      .then(response => response);
  }

  atualizar(conta: Conta): Promise<Conta> {
    return this.http
      .put<any>(`${this.contasUrl}/${conta.id}`, conta)
      .toPromise()
      .then(response => response as Conta);
  }

  buscarPorCodigo(id: number): Promise<Conta> {
    return this.http
      .get<any>(`${this.contasUrl}/${id}`)
      .toPromise()
      .then(response => response as Conta);
  }

  listarAll(): Promise<any> {
    return this.http
      .get<any>(`${this.contasUrl}/listarAll`)
      .toPromise()
      .then(response => response as Conta);
  }
}
