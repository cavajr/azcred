import { Injectable } from "@angular/core";
import { HttpHeaders, HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";
import 'rxjs/add/operator/map';

import { SistemaHttp } from "../../seguranca/sistema-http";
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class PagamentosService {

  pagamentoUrl: string;

  constructor(public http: SistemaHttp) {
    this.pagamentoUrl = `${environment.apiUrl}/pagamentos`;
  }

  pesquisar(): Promise<any> {
    return this.http
      .get<any>(`${this.pagamentoUrl}`)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  pagar(itens: any): Promise<any> {
    return this.http
      .post<any>(this.pagamentoUrl, itens)
      .toPromise()
      .then(response => response);
  }

  relatorioPagamento(parametros) {
    let params = new HttpParams({});

    if (parametros.selecionados) {
      params = params.append("selected", parametros.selecionados);
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.pagamentoUrl}/imprimirPagamentos`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }
}
