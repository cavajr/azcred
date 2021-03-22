import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { AuthService } from "./../../../seguranca/auth.service";

import { LazyLoadEvent } from "../../../../../node_modules/primeng/components/common/api";
import { ErrorHandlerService } from "./../../../core/error-handler.service";

import { ConvenioService, ConvenioFiltro } from "./../convenio.service";

import { Convenio } from "./../../../core/model";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-convenios-pesquisa",
  templateUrl: "./convenios-pesquisa.component.html",
  styleUrls: ["./convenios-pesquisa.component.css"]
})
export class ConveniosPesquisaComponent implements OnInit {
  oculto = "oculto";

  convenio: Convenio;

  filtro = new ConvenioFiltro();
  totalRegistros = 0;
  convenios = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private convenioService: ConvenioService,
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
    this.convenioService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.convenios = resultado.convenios;
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
    this.convenio = new Convenio();
  }

  editar(event: any, convenio: Convenio) {
    event.preventDefault();
    this.convenio = this.clonarBanco(convenio);
    this.oculto = "";
  }

  adicionarBanco(form: FormControl) {
    this.convenioService
      .adicionar(this.convenio)
      .then(bancoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarBanco(form: FormControl) {
    this.convenioService
      .atualizar(this.convenio)
      .then(convenio => {
        this.convenio = convenio;
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

  clonarBanco(convenio: Convenio): Convenio {
    return new Convenio(convenio.id, convenio.nome, convenio.ativo);
  }

  get editando() {
    return this.convenio && this.convenio.id;
  }
}
