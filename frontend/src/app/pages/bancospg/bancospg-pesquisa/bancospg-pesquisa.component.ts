import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { LazyLoadEvent } from "../../../../../node_modules/primeng/components/common/api";

import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { AuthService } from "./../../../seguranca/auth.service";
import { BancopgFiltro, BancospgService } from "./../bancospg.service";
import { Bancopg } from "../../../core/model";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-bancospg-pesquisa",
  templateUrl: "./bancospg-pesquisa.component.html",
  styleUrls: ["./bancospg-pesquisa.component.css"]
})
export class BancospgPesquisaComponent implements OnInit {
  oculto = "oculto";

  bancopg: Bancopg;

  filtro = new BancopgFiltro();
  totalRegistros = 0;
  bancospg = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private bancopgService: BancospgService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  pesquisar(pagina = 0) {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.bancopgService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.bancospg = resultado.bancospg;
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

  novo(event: any) {
    event.preventDefault();
    this.oculto = "";
    this.bancopg = new Bancopg();
  }

  editar(event: any, bancopg: Bancopg) {
    event.preventDefault();
    this.bancopg = this.clonarBanco(bancopg);
    this.oculto = "";
  }

  adicionarBanco(form: FormControl) {
    this.bancopgService
      .adicionar(this.bancopg)
      .then(bancoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarBanco(form: FormControl) {
    this.bancopgService
      .atualizar(this.bancopg)
      .then(bancopg => {
        this.bancopg = bancopg;
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmar(frm: FormControl) {
    if (this.editando) {
      this.atualizarBanco(frm);
    } else {
      this.adicionarBanco(frm);
    }
    this.oculto = "oculto";
    frm.reset();
    this.grid.first = 0;
    this.pesquisar(0);
  }

  clonarBanco(bancopg: Bancopg): Bancopg {
    return new Bancopg(bancopg.id, bancopg.nome, bancopg.ativo);
  }

  get editando() {
    return this.bancopg && this.bancopg.id;
  }
}
