import { PerfilsService } from "./../../perfils/perfils.service";
import { Component, OnInit } from "@angular/core";

import { SharedService } from "../../../shared/shared.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { TabelasService, TabelaFiltro } from "./../tabelas.service";

import swal from "sweetalert";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-tabelas-pesquisa",
  templateUrl: "./tabelas-pesquisa.component.html",
  styleUrls: ["./tabelas-pesquisa.component.css"]
})
export class TabelasPesquisaComponent implements OnInit {
  listaBancos = [];
  listaConvenios = [];
  listaTipos = [];
  listaPerfis = [];

  loading: boolean;

  filtro: TabelaFiltro = new TabelaFiltro();
  tabelas = [];

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private sharedService: SharedService,
    private tabelaService: TabelasService,
    private perfilService: PerfilsService,
    private toastr: ToastrService
  ) {
    this.carregarBancos();
    this.carregarConvenios();
    this.carregarTipos();
    this.carregarPerfis();
  }

  ngOnInit() {}

  pesquisar(): void {
    this.loading = true;
    this.tabelaService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.tabelas = resultado;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  carregarTipos() {
    this.sharedService
      .listarTipos()
      .then(tipos => {
        this.listaTipos = tipos.map(b => ({
          label: b.nome,
          value: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPerfis() {
    this.perfilService
      .listarAll()
      .then(perfis => {
        this.listaPerfis = perfis;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarBancos() {
    this.sharedService
      .listarBancos()
      .then(bancos => {
        this.listaBancos = bancos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarConvenios() {
    this.sharedService
      .listarConvenios()
      .then(convenios => {
        this.listaConvenios = convenios;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  exportar() {
    this.loading = true;
    this.tabelaService.exportar(this.filtro).subscribe(
      relatorio => {
        this.loading = false;
        let file = new Blob([relatorio], { type: "application/vnd.ms-excel" });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      error => {
        this.loading = false;
      }
    );
  }
}
