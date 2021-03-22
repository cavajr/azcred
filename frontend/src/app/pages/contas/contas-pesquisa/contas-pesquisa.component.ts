import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { AuthService } from "./../../../seguranca/auth.service";
import { ContaFiltro, ContasService } from "./../contas.service";
import { LazyLoadEvent } from "../../../../../node_modules/primeng/components/common/api";

import { Conta } from "./../../../core/model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-contas-pesquisa",
  templateUrl: "./contas-pesquisa.component.html",
  styleUrls: ["./contas-pesquisa.component.css"]
})
export class ContasPesquisaComponent implements OnInit {
  oculto = "oculto";

  conta: Conta;

  filtro = new ContaFiltro();
  totalRegistros = 0;
  contas = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private contaService: ContasService,
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
    this.contaService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.contas = resultado.contas;
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
    this.conta = new Conta();
  }

  editar(event: any, conta: Conta) {
    event.preventDefault();
    this.conta = this.clonar(conta);
    this.oculto = "";
  }

  adicionar(form: FormControl) {
    this.contaService
      .adicionar(this.conta)
      .then(contaAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.contaService
      .atualizar(this.conta)
      .then(conta => {
        this.conta = conta;
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

  clonar(conta: Conta): Conta {
    return new Conta(conta.id, conta.nome, conta.ativo);
  }

  get editando() {
    return this.conta && this.conta.id;
  }
}
