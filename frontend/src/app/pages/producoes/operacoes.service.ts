import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Producao } from '../../core/model';

import 'rxjs/add/operator/toPromise';

import { SistemaHttp } from '../../seguranca/sistema-http';

import { environment } from '../../../environments/environment';

import * as moment from 'moment';

export class OperacaoFiltro {
  pago: string;
  corretor: number;
  operacao: string;
  ncr: Date;
  cliente: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: 'root'
})
export class OperacoesService {
  operacoesUrl: string;

  constructor(public http: SistemaHttp) {
    this.operacoesUrl = `${environment.apiUrl}/operacoes`;
  }

  pesquisar(filtro: OperacaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.corretor) {
      params = params.append('corretor', filtro.corretor.toString());
    }

    if (filtro.cliente) {
      params = params.append('cliente', filtro.cliente.toString());
    }

    if (filtro.operacao) {
      params = params.append(
        'operacao',
        filtro.operacao.toString()
      );
    }

    if (filtro.pago) {
      params = params.append(
        "pago",
        filtro.pago.toString()
      );
    }

    if (filtro.ncr) {
      params = params.append('ncr', moment(filtro.ncr).format('YYYY-MM-DD'));
    }

    return this.http
      .get<any>(`${this.operacoesUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const producoes = responseJson.data;
        return {
          producoes,
          total: responseJson.total
        };
      });
  }

  adicionar(producao: Producao): Promise<Producao> {
    return this.http
      .post<any>(this.operacoesUrl, producao)
      .toPromise()
      .then(response => response.data);
  }


  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.operacoesUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  buscarPorCodigo(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.operacoesUrl}/${id}`)
      .toPromise()
      .then(response => {
        const contratoAlterado = response;

        this.converterStringsParaDatas([contratoAlterado]);

        return contratoAlterado;
      });
  }

  private converterStringsParaDatas(contratos: any[]) {
    for (const contrato of contratos) {
      contrato.data_operacao = moment(
        contrato.data_operacao,
        'YYYY-MM-DD'
      ).toDate();

      if (contrato.data_credito_cliente) {
        contrato.data_credito_cliente = moment(
          contrato.data_credito_cliente,
          'YYYY-MM-DD'
        ).toDate();
      }

      if (contrato.data_fisico) {
        contrato.data_fisico = moment(
          contrato.data_fisico,
          'YYYY-MM-DD'
        ).toDate();
      }

      if (contrato.data_ncr) {
        contrato.data_ncr = moment(contrato.data_ncr, 'YYYY-MM-DD').toDate();
      }
    }
  }
}
