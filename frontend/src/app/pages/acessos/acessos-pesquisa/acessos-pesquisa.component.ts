import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";

import { LazyLoadEvent } from "primeng/components/common/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Acesso } from "../../../core/model";
import { AcessoFiltro, AcessosService } from "../acessos.service";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-acessos-pesquisa",
  templateUrl: "./acessos-pesquisa.component.html",
  styleUrls: ["./acessos-pesquisa.component.scss"]
})
export class AcessosPesquisaComponent implements OnInit {
  oculto = "oculto";

  acesso: Acesso;

  filtro: AcessoFiltro = new AcessoFiltro();
  totalRegistros = 0;
  acessos = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private acessoService: AcessosService,
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
    this.acessoService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.acessos = resultado.acessos;
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
    this.acesso = new Acesso();
  }

  editar(event: any, acesso: Acesso) {
    event.preventDefault();
    this.acesso = this.clonar(acesso);
    this.oculto = "";
  }

  adicionar(form: FormControl) {
    this.acessoService
      .adicionar(this.acesso)
      .then(bancoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.acessoService
      .atualizar(this.acesso)
      .then(acesso => {
        this.acesso = acesso;
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

  clonar(acesso: Acesso): Acesso {
    return new Acesso(
      acesso.id,
      acesso.banco,
      acesso.emprestimo,
      acesso.login,
      acesso.senha,
      acesso.link
    );
  }

  get editando() {
    return this.acesso && this.acesso.id;
  }

  confirmarExclusao(acesso: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(acesso);
      }
    });
  }

  excluir(acesso: any) {
    this.acessoService
      .excluir(acesso.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
