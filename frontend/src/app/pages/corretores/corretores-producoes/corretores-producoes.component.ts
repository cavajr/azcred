import { Component, OnInit, ViewChild } from "@angular/core";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Producao } from "../../../core/model";
import { CorretoresProducoesService } from "../corretores-producoes.service";
import { CorretorProducaoFiltro } from "./../corretores-producoes.service";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

@Component({
  selector: "app-corretores-producoes",
  templateUrl: "./corretores-producoes.component.html",
  styleUrls: ["./corretores-producoes.component.css"]
})
export class CorretoresProducoesComponent implements OnInit {
  oculto = "oculto";

  bsConfig: Partial<BsDatepickerConfig>;

  producao: Producao;

  filtro: CorretorProducaoFiltro = new CorretorProducaoFiltro();
  totalRegistros = 0;
  producoes = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;
  blocked: boolean;

  fisicoPendente = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" }
  ];

  constructor(
    private producoesService: CorretoresProducoesService,
    private errorHandler: ErrorHandlerService,
    private localeService: BsLocaleService,
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
    this.loading = true;
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.filtro.corretor = this.auth.jwtPayload.user.corretor_id;
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

  exportar() {
    this.blocked = true;
    this.filtro.corretor = this.auth.jwtPayload.user.corretor_id;
    this.producoesService.exportar(this.filtro).subscribe(
      relatorio => {
        this.blocked = false;
        let file = new Blob([relatorio], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      error => {
        this.blocked = false;
      }
    );
  }
}
