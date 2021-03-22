import {
  CorretorTabelaFiltro,
  CorretoresTabelasService
} from "./../corretores-tabelas.service";
import { Component, OnInit } from "@angular/core";

import { SharedService } from "../../../shared/shared.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-corretores-tabelas",
  templateUrl: "./corretores-tabelas.component.html",
  styleUrls: ["./corretores-tabelas.component.scss"]
})
export class CorretoresTabelasComponent implements OnInit {
  listaBancos = [];
  listaConvenios = [];
  listaTipos = [];

  loading: boolean;

  filtro: CorretorTabelaFiltro = new CorretorTabelaFiltro();

  tabelas = [];

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private sharedService: SharedService,
    private tabelaService: CorretoresTabelasService
  ) {
    this.carregarBancos();
    this.carregarConvenios();
    this.carregarTipos();
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
        this.listaTipos = tipos;
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
        let file = new Blob([relatorio], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      error => {
        this.loading = false;
      }
    );
  }
}
