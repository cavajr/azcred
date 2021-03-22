import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";

import "rxjs/add/operator/toPromise";

import { SistemaHttp } from "../../seguranca/sistema-http";

import { environment } from "../../../environments/environment";

import * as moment from "moment";
import { Producao } from "../../core/model";

export class ProducaoFiltro {
  cpf: string;
  cliente: string;
  corretor: number;
  fisico_pendente: string;
  com_corretor: string;
  ncr: Date;
  pago: string;
  pagina = 0;
  itensPorPagina = 10;
}

export class ResumoFiltro {
  de: Date;
  ate: Date;
  cpf: string;
  cliente: string;
  corretor: number;
  banco: string;
  tabela: string;
  pagina = 0;
  itensPorPagina = 15;
}

@Injectable({
  providedIn: "root"
})
export class ProducoesService {
  producoesUrl: string;

  constructor(public http: SistemaHttp) {
    this.producoesUrl = `${environment.apiUrl}/producoes`;
  }

  pesquisar(filtro: ProducaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.cpf) {
      params = params.append("cpf", filtro.cpf.toString());
    }

    if (filtro.cliente) {
      params = params.append("cliente", filtro.cliente.toString());
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    if (filtro.com_corretor) {
      params = params.append('com_corretor', filtro.com_corretor.toString());
    }

    if (filtro.fisico_pendente) {
      params = params.append(
        "fisico_pendente",
        filtro.fisico_pendente.toString()
      );
    }

    if (filtro.pago) {
      params = params.append(
        "pago",
        filtro.pago.toString()
      );
    }

    if (filtro.ncr) {
      params = params.append("ncr", moment(filtro.ncr).format("YYYY-MM-DD"));
    }

    return this.http
      .get<any>(`${this.producoesUrl}`, { params })
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

  resumo(filtro: ResumoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.cpf) {
      params = params.append("cpf", filtro.cpf.toString());
    }

    if (filtro.cliente) {
      params = params.append("cliente", filtro.cliente.toString());
    }

    if (filtro.banco) {
      params = params.append("banco", filtro.banco.toString());
    }

    if (filtro.tabela) {
      params = params.append("tabela", filtro.tabela.toString());
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    if (filtro.de) {
      params = params.append("inicio", moment(filtro.de).format("YYYY-MM-DD"));
    }

    if (filtro.ate) {
      params = params.append("fim", moment(filtro.ate).format("YYYY-MM-DD"));
    }

    return this.http
      .get<any>(`${this.producoesUrl}/resumo`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const producoes = responseJson.contrato.data;
        return {
          producoes,
          total_contratos: responseJson.total_contratos,
          total_valor_agente: responseJson.total_valor_agente,
          total_valor_comissao: responseJson.total_valor_comissao,
          total_valor_empresa: responseJson.total_valor_empresa,
          total: responseJson.contrato.total
        };
      });
  }

  estornos(filtro: ProducaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.cpf) {
      params = params.append("cpf", filtro.cpf.toString());
    }

    if (filtro.cliente) {
      params = params.append("cliente", filtro.cliente.toString());
    }

    if (filtro.corretor) {
      params = params.append("corretor", filtro.corretor.toString());
    }

    if (filtro.fisico_pendente) {
      params = params.append(
        "fisico_pendente",
        filtro.fisico_pendente.toString()
      );
    }

    if (filtro.ncr) {
      params = params.append("ncr", moment(filtro.ncr).format("YYYY-MM-DD"));
    }

    return this.http
      .get<any>(`${this.producoesUrl}/estornos`, { params })
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
      .post<any>(this.producoesUrl, producao)
      .toPromise()
      .then(response => response.data);
  }

  atualizar(producao: any): Promise<any> {
    return this.http
      .put<any>(`${this.producoesUrl}/${producao.id}`, producao)
      .toPromise()
      .then(response => {
        const contratoAlterado = response;

        this.converterStringsParaDatas([contratoAlterado]);

        return contratoAlterado;
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.producoesUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  buscarPorCodigo(id: number): Promise<any> {
    return this.http
      .get<any>(`${this.producoesUrl}/${id}`)
      .toPromise()
      .then(response => {
        const contratoAlterado = response;

        this.converterStringsParaDatas([contratoAlterado]);

        return contratoAlterado;
      });
  }

  retornaComissao(id: number, idContrato: number): Promise<any> {
    return this.http
      .get<any>(`${this.producoesUrl}/${idContrato}/comissao/${id}`)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  private converterStringsParaDatas(contratos: any[]) {
    for (const contrato of contratos) {
      contrato.data_operacao = moment(
        contrato.data_operacao,
        "YYYY-MM-DD"
      ).toDate();

      if (contrato.data_credito_cliente) {
        contrato.data_credito_cliente = moment(
          contrato.data_credito_cliente,
          "YYYY-MM-DD"
        ).toDate();
      }

      if (contrato.data_fisico) {
        contrato.data_fisico = moment(
          contrato.data_fisico,
          "YYYY-MM-DD"
        ).toDate();
      }

      if (contrato.data_ncr) {
        contrato.data_ncr = moment(contrato.data_ncr, "YYYY-MM-DD").toDate();
      }
    }
  }
}
