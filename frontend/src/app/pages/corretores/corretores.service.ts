import { Injectable } from "@angular/core";
import { SistemaHttp } from "../../seguranca/sistema-http";
import { environment } from "../../../environments/environment";
import { HttpParams, HttpHeaders } from "@angular/common/http";
import { Corretor } from "../../core/model";

import "rxjs/add/operator/map";

import * as moment from "moment";

export class CorretorFiltro {
  nome: string;
  cpf: string;
  pagina = 0;
  itensPorPagina = 10;
}

export class CorretorContratoFiltro {
  cpf: string;
  cliente: string;
  banco: string;
  proposta: string;
  pagina = 0;
  itensPorPagina = 8;
}


@Injectable({
  providedIn: "root"
})
export class CorretoresService {
  corretoresUrl: string;

  constructor(public http: SistemaHttp) {
    this.corretoresUrl = `${environment.apiUrl}/corretores`;
  }

  pesquisar(filtro: CorretorFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append("nome", filtro.nome);
    }
    return this.http
      .get<any>(`${this.corretoresUrl}`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const corretores = responseJson.data;
        return {
          corretores,
          total: responseJson.total
        };
      });
  }

  excluir(id: number): Promise<void> {
    return this.http
      .delete(`${this.corretoresUrl}/${id}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(corretor: Corretor): Promise<any> {
    return this.http
      .post<any>(this.corretoresUrl, corretor)
      .toPromise()
      .then(response => {
        return response;
      });
  }

  atualizar(corretor: Corretor): Promise<Corretor> {
    return this.http
      .put<any>(`${this.corretoresUrl}/${corretor.id}`, corretor)
      .toPromise()
      .then(response => {
        const corretorAlterado = response;

        this.converterStringsParaDatas([corretorAlterado]);

        return corretorAlterado;
      });
  }

  atualizarAcesso(corretor: Corretor): Promise<Corretor> {
    return this.http
      .put<any>(`${this.corretoresUrl}/acessos`, corretor)
      .toPromise()
      .then(response => {
        const corretorAlterado = response;

        this.converterStringsParaDatas([corretorAlterado]);

        return corretorAlterado;
      });
  }

  buscarPorCodigo(id: number): Promise<Corretor> {
    return this.http
      .get<any>(`${this.corretoresUrl}/${id}`)
      .toPromise()
      .then(response => {
        const corretorAlterado = response;
        this.converterStringsParaDatas([corretorAlterado]);
        return corretorAlterado;
      });
  }

  private converterStringsParaDatas(corretores: Corretor[]) {
    for (const corretor of corretores) {
      if (corretor.data_adm) {
        corretor.data_adm = moment(corretor.data_adm, "YYYY-MM-DD").toDate();
      }
      if (corretor.data_nasc) {
        corretor.data_nasc = moment(corretor.data_nasc, "YYYY-MM-DD").toDate();
      }
    }
  }

  listarCorretores() {
    return this.http
      .get<any>(`${this.corretoresUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  listarAtivos() {
    return this.http
      .get<any>(`${this.corretoresUrl}/listarAll`)
      .toPromise()
      .then(response => response);
  }

  contaComissao(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.promotor_id) {
      params = params.append("promotor", parametros.promotor_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get<any>(`${this.corretoresUrl}/relatorios/conta-comissao`, {
        headers,
        params
      })
      .toPromise()
      .then(response => response);
  }

  relatorioRecibos(parametros) {
    let params = new HttpParams({});

    if (parametros.de) {
      params = params.append(
        "inicio",
        moment(parametros.de).format("YYYY-MM-DD")
      );
    }

    if (parametros.ate) {
      params = params.append(
        "fim",
        moment(parametros.ate).format("YYYY-MM-DD")
      );
    }

    if (parametros.promotor_id) {
      params = params.append("promotor", parametros.promotor_id.toString());
    }

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json; charset=utf-8");

    return this.http
      .get(`${this.corretoresUrl}/relatorios/comissao`, {
        headers,
        params,
        responseType: "blob"
      })
      .map((res: any) => {
        return res;
      });
  }

  enviarRemessa(remessa: any[]): Promise<any> {
    return this.http
      .post<any>(`${this.corretoresUrl}/remessa-enviar`, { remessa })
      .toPromise()
      .then(response => response);
  }

  contratos(filtro: CorretorContratoFiltro): Promise<any> {
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

    if (filtro.proposta) {
      params = params.append("proposta", filtro.proposta.toString());
    }

    return this.http
      .get<any>(`${this.corretoresUrl}/contratos`, { params })
      .toPromise()
      .then(response => {
        const responseJson = response;
        const contratos = responseJson.data;
        return {
          contratos,
          total: responseJson.total
        };
      });
  }

}
