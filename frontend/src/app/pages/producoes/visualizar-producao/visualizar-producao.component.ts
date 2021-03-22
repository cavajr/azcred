import { Component, OnInit, ViewChild } from "@angular/core";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Producao } from "../../../core/model";
import { ProducaoFiltro, ProducoesService } from "../producoes.service";
import { CorretoresService } from "./../../corretores/corretores.service";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-visualizar-producao",
  templateUrl: "./visualizar-producao.component.html",
  styleUrls: ["./visualizar-producao.component.css"]
})
export class VisualizarProducaoComponent implements OnInit {
  oculto = "oculto";

  isDisable = false;

  bsConfig: Partial<BsDatepickerConfig>;

  producao: Producao;

  filtro: ProducaoFiltro = new ProducaoFiltro();
  totalRegistros = 0;
  producoes = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  listaCorretores = [];

  corretores = [];

  fisicoPendente = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" }
  ];

  pagos = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" }
  ];

  constructor(
    private producoesService: ProducoesService,
    private errorHandler: ErrorHandlerService,
    private localeService: BsLocaleService,
    private corretorService: CorretoresService,
    private toastr: ToastrService,
    public auth: AuthService
  ) {
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
    this.filtro.com_corretor = 'S';
    if (sessionStorage.producoes) {
      this.filtro = JSON.parse(sessionStorage.getItem("producoes"));
    }
    this.loading = true;
    this.carregarCorretores();
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    sessionStorage.setItem("producoes", JSON.stringify(this.filtro));
    this.producoesService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.producoes = resultado.producoes;
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

  confirmarExclusao(usuario: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(usuario);
      }
    });
  }

  excluir(producao: any) {
    this.producoesService
      .excluir(producao.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  onChange(event) {
    if (event.value === 'S') {
      this.isDisable = false;
    } else if (event.value === 'N') {
      this.isDisable = true;
    }
  }
}
