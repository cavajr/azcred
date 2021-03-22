import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Producao } from "../../../core/model";
import { ResumoFiltro, ProducoesService } from "../producoes.service";
import { CorretoresService } from "./../../corretores/corretores.service";
import { SharedService } from "./../../../shared/shared.service";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

import swal from "sweetalert";

@Component({
  selector: "app-resumo-producao",
  templateUrl: "./resumo-producao.component.html",
  styleUrls: ["./resumo-producao.component.css"]
})
export class ResumoProducaoComponent implements OnInit {
  oculto = "oculto";

  bsConfig: Partial<BsDatepickerConfig>;

  producao: Producao;

  filtro: ResumoFiltro = new ResumoFiltro();
  totalRegistros = 0;
  producoes = [];
  @ViewChild("tabela")
  grid;

  total_contratos = 0;
  total_valor_agente = 0;
  total_valor_comissao = 0;
  total_valor_empresa = 0;

  loading: boolean;

  listaCorretores = [];
  listaBancos = [];
  listaConvenios = [];

  corretores = [];

  constructor(
    private producoesService: ProducoesService,
    private errorHandler: ErrorHandlerService,
    private localeService: BsLocaleService,
    private corretorService: CorretoresService,
    private sharedService: SharedService,
    public auth: AuthService
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
    this.carregarCorretores();
  }

  verificar() {
    if ((!this.filtro.de) || (!this.filtro.ate)) {
      swal(
        "Atenção",
        "Nenhum período informado corretamente !",
        "warning"
      );
      this.producoes = [];
      return
    }
    this.pesquisar(0);
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.producoesService
      .resumo(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.producoes = resultado.producoes;
        this.total_contratos = resultado.total_contratos;
        this.total_valor_agente = resultado.total_valor_agente;
        this.total_valor_comissao = resultado.total_valor_comissao;
        this.total_valor_empresa = resultado.total_valor_empresa;
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

  carregarCorretores() {
    this.corretorService
      .listarCorretores()
      .then(corretores => {
        this.listaCorretores = corretores.map(b => ({
          label: b.nome,
          value: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
