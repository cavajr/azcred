import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Sistema } from "../../../core/model";
import { SistemaFiltro, SistemasService } from "../sistemas.service";

import swal from "sweetalert";

@Component({
  selector: "app-sistemas-pesquisa",
  templateUrl: "./sistemas-pesquisa.component.html",
  styleUrls: ["./sistemas-pesquisa.component.css"]
})
export class SistemasPesquisaComponent implements OnInit {
  oculto = "oculto";

  sistema: Sistema;

  filtro: SistemaFiltro = new SistemaFiltro();
  totalRegistros = 0;
  sistemas = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private sistemaService: SistemasService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    // init_plugins();
  }

  pesquisar(pagina = 0): void {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.sistemaService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.sistemas = resultado.sistemas;
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
    this.sistema = new Sistema();
  }

  editar(sistema: Sistema) {
    event.preventDefault();
    this.sistema = this.clonar(sistema);
    this.oculto = "";
  }

  adicionar(form: FormControl) {
    this.sistemaService
      .adicionar(this.sistema)
      .then(bancoAdicionado => {
        swal("Sucesso", "Registro adicionado com sucesso!", "success");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.sistemaService
      .atualizar(this.sistema)
      .then(sistema => {
        this.sistema = sistema;
        this.grid.first = 0;
        this.pesquisar(0);
        swal("Sucesso", "Registro alterado com sucesso!", "success");
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

  clonar(sistema: Sistema): Sistema {
    return new Sistema(sistema.id, sistema.nome, sistema.ativo);
  }

  get editando() {
    return this.sistema && this.sistema.id;
  }
}
