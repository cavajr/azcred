import { Component, OnInit, ViewChild } from "@angular/core";

import { ErrorHandlerService } from './../../../core/error-handler.service';
import { AuthService } from './../../../seguranca/auth.service';
import { CorretorContratoFiltro, CorretoresService } from "./../corretores.service";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

import { LazyLoadEvent } from "primeng/api";

import swal from "sweetalert";

@Component({
  selector: "app-corretores-remessa",
  templateUrl: "./corretores-remessa.component.html",
  styleUrls: ["./corretores-remessa.component.css"]
})
export class CorretoresRemessaComponent implements OnInit {
  contratos = [];
  selecionados = [];
  itemIndex: number;
  bsConfig: Partial<BsDatepickerConfig>;

  filtro: CorretorContratoFiltro = new CorretorContratoFiltro();
  totalRegistros = 0;

  @ViewChild("tabela")
  grid;

  @ViewChild("tabelaSelecionados")
  gridSelecionado;

  loading: boolean;

  constructor(
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private localeService: BsLocaleService,
    private corretoresService: CorretoresService,
  ) {
    // Datapicker Configuração
    this.localeService.use("pt-br");
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-dark-blue",
        dateInputFormat: "DD/MM/YYYY",
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    this.loading = true;
    if (sessionStorage.contratos) {
      this.filtro = JSON.parse(sessionStorage.getItem("contratos"));
    }
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    sessionStorage.setItem("contratos", JSON.stringify(this.filtro));
    this.corretoresService
      .contratos(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.contratos = resultado.contratos;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  adicionar(index: number, contrato) {
    this.itemIndex = this.selecionados.length;
    let posicao = 0;
    let flag = false;
    for (let i = 0; i < this.selecionados.length; i++) {
      if (this.selecionados[i].id === contrato.id) {
        flag = true;
        posicao = i;
      }
    }

    if (flag === false) {
      this.selecionados[this.itemIndex] = contrato;
    } else {
      this.selecionados[posicao] = contrato;
    }
    this.contratos.splice(index, 1);
  }

  remover(index: number, selecionado) {
    this.contratos = [...this.contratos, selecionado];
    this.selecionados.splice(index, 1);
  }

  enviar() {
    this.corretoresService
      .enviarRemessa(this.selecionados)
      .then(resultado => {
        swal("Sucesso", "Remessa enviada com sucesso!", "success");
        this.selecionados = [];
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
