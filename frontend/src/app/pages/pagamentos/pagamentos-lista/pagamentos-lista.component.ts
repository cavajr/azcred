import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { PagamentosService } from "../pagamentos.service";

import swal from "sweetalert";

@Component({
  selector: "app-pagamentos-lista",
  templateUrl: "./pagamentos-lista.component.html",
  styleUrls: ["./pagamentos-lista.component.scss"]
})
export class PagamentosListaComponent implements OnInit {
  corretores = [];

  selecionados = [];

  tarifas = [];

  totalComissao = 0;
  totalGeral = 0;
  totalTarifa = 0;

  constructor(
    private pagamentoService: PagamentosService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.pesquisar();
  }

  pagar() {
    this.pagamentoService
      .pagar(this.selecionados)
      .then(resultado => {
        if (resultado.status === 'OK') {
          const selected = this.selecionados.filter(x => x.contratos.id).map(x => x.contratos.id);
          swal("Sucesso", "Pagamento efetuado com sucesso!", "success");
          this.gerar(selected);
          this.selecionados = [];
          this.totalComissao = 0;
          this.totalGeral = 0;
          this.totalTarifa = 0;
        }
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
    this.pesquisar();
  }

  gerar(selecionados) {
    this.pagamentoService
      .relatorioPagamento({
        selecionados: selecionados
      })
      .subscribe(
        relatorio => {
          let file = new Blob([relatorio], { type: "application/pdf" });
          const url = window.URL.createObjectURL(file);
          window.open(url);
        },
        error => {
          if (error.status === 422) {
            swal("Erro", "Nenhum dado foi encontrado para a pesquisa", "error");
          }
        }
      );
  }

  pesquisar(): void {
    this.somaGeral();
    this.pagamentoService
      .pesquisar()
      .then(resultado => {
        this.corretores = resultado;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  removeContrato(doc) {
    this.selecionados.forEach((item, index) => {
      if (item.contratos.id === doc) {
        this.selecionados.splice(index, 1);
      }
    });
  }

  somaTarifas() {
    this.tarifas = [];
    const map = new Map();
    for (const item of this.selecionados) {
      if (!map.has(item.corretor)) {
        map.set(item.corretor, true);
        this.tarifas.push({
          corretor: item.corretor,
          tarifa: item.tarifa
        });
      }
    }
    this.totalTarifa = 0;
    this.tarifas.forEach(element => {
      this.totalTarifa = this.totalTarifa + element.tarifa;
    });
  }

  somaGeral() {
    this.totalComissao = 0;
    this.selecionados.forEach(element => {
      this.totalComissao =
        this.totalComissao + element.contratos.corretor_valor_comissao;
    });
    this.somaTarifas();
    this.totalGeral = this.totalComissao - this.totalTarifa;
  }

  onRowSelect(event) {
    this.selecionados.push(event);
    this.somaGeral();
  }

  onRowUnselect(event) {
    this.removeContrato(event.contratos.id);
    this.somaGeral();
  }

  temSelecionados() {
    if (this.selecionados.length > 0) {
      return true;
    }
    return false;
  }

  selectAll(dados) {
    for (let index = 0; index < dados.length; index++) {
      if (dados[index].event) {
        this.selecionados.push({
          corretor: dados[index].corretor,
          tarifa: dados[index].tarifa,
          contratos: dados[index].contratos
        });
      } else {
        for (let index = 0; index < dados.length; index++) {
          let element = dados[index];
          this.removeContrato(element.contratos.id);
        }
      }
    }
    this.somaGeral();
  }
}
