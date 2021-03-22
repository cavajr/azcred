import { Component, OnInit, ViewChild } from "@angular/core";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { FinanceiroService, FinanceiroFiltro } from "../financeiro.service";
import { LazyLoadEvent } from "primeng/components/common/api";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
defineLocale("pt-br", ptBrLocale);
ptBrLocale.invalidDate = "Data inválida";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-financeiro-pesquisa",
  templateUrl: "./financeiro-pesquisa.component.html",
  styleUrls: ["./financeiro-pesquisa.component.css"]
})
export class FinanceiroPesquisaComponent implements OnInit {
  filtro: FinanceiroFiltro = new FinanceiroFiltro();
  totalRegistros = 0;
  financeiros = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  tipos = [
    { label: "Receita", value: 1 },
    { label: "Despesa", value: 2 }
  ];

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private errorHandler: ErrorHandlerService,
    private toastr: ToastrService,
    public auth: AuthService,
    private localeService: BsLocaleService,
    private financeiroService: FinanceiroService
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
    this.financeiroService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.financeiros = resultado.financeiros;
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

  confirmarExclusao(financeiro: any): void {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(financeiro);
      }
    });
  }

  excluir(financeiro: any) {
    this.financeiroService
      .excluir(financeiro.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
