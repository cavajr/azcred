import { AuthService } from './../../../seguranca/auth.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { Component, OnInit, ViewChild } from "@angular/core";

import { LazyLoadEvent } from "primeng/api";

import { RemessasService, RemessaFiltro } from "./../remessas.service";
import { CorretoresService } from "./../../corretores/corretores.service";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-remessas-pesquisa",
  templateUrl: "./remessas-pesquisa.component.html",
  styleUrls: ["./remessas-pesquisa.component.css"]
})
export class RemessasPesquisaComponent implements OnInit {
  blocked = false;
  filtro: RemessaFiltro = new RemessaFiltro();
  totalRegistros = 0;
  remessas = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;
  listaCorretores = [];
  listaStatus = [];

  constructor(
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private toastr: ToastrService,
    private corretorService: CorretoresService,
    private remessaService: RemessasService,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.carregarCorretores();
    this.carregarStatus();
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.remessaService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.remessas = resultado.remessas;
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

  confirmarExclusao(remessa: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(remessa);
      }
    });
  }

  excluir(remessa: any) {
    this.remessaService
      .excluir(remessa.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
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

  carregarStatus() {
    this.remessaService
      .listarStatus()
      .then(status => {
        this.listaStatus = status.map(b => ({
          label: b.nome,
          value: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  gerar(remessa) {
    this.blocked = true;
    this.remessaService
      .relatorioRemessa({ lote: remessa.id, promotor: remessa.corretor })
      .subscribe(
        relatorio => {
          this.blocked = false;
          let file = new Blob([relatorio], { type: "application/pdf" });
          const url = window.URL.createObjectURL(file);
          window.open(url);
        },
        error => {
          this.blocked = false;
          if (error.status === 422) {
            swal("Erro", "Nenhum dado foi encontrado para a pesquisa", "error");
          }
        }
      );
  }
}
