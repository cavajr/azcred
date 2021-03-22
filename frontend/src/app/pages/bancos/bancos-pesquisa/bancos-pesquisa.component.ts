import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Banco } from "../../../core/model";
import { BancoFiltro, BancosService } from "../bancos.service";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-bancos-pesquisa",
  templateUrl: "./bancos-pesquisa.component.html",
  styleUrls: ["./bancos-pesquisa.component.css"]
})
export class BancosPesquisaComponent implements OnInit {
  oculto = "oculto";

  banco: Banco;

  filtro: BancoFiltro = new BancoFiltro();
  totalRegistros = 0;
  bancos = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private bancoService: BancosService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.bancoService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.bancos = resultado.bancos;
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
    this.banco = new Banco();
  }

  editar(event: any, banco: Banco) {
    event.preventDefault();
    this.banco = this.clonar(banco);
    this.oculto = "";
  }

  adicionar(form: FormControl) {
    this.bancoService
      .adicionar(this.banco)
      .then(bancoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.bancoService
      .atualizar(this.banco)
      .then(banco => {
        this.banco = banco;
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmar(frm: FormControl) {
    if (this.editando) {
      this.atualizar(frm);
    } else {
      this.adicionar(frm);
    }
    this.oculto = "oculto";
    frm.reset();
    this.grid.first = 0;
    this.pesquisar(0);
  }

  clonar(banco: Banco): Banco {
    return new Banco(banco.id, banco.nome, banco.ativo);
  }

  get editando() {
    return this.banco && this.banco.id;
  }
}
