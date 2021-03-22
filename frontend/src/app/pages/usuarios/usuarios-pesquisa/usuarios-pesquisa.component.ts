import { Component, OnInit, ViewChild } from "@angular/core";

import { LazyLoadEvent } from "../../../../../node_modules/primeng/components/common/api";

import { AuthService } from "./../../../seguranca/auth.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { UsuarioFiltro, UsuariosService } from "./../usuarios.service";
import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-usuarios-pesquisa",
  templateUrl: "./usuarios-pesquisa.component.html",
  styleUrls: ["./usuarios-pesquisa.component.css"]
})
export class UsuariosPesquisaComponent implements OnInit {
  filtro = new UsuarioFiltro();
  totalRegistros = 0;
  usuarios = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private usuarioService: UsuariosService,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  pesquisar(pagina = 0) {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.usuarioService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.usuarios = resultado.usuarios;
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

  confirmarExclusao(usuario: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(usuario);
      }
    });
  }

  excluir(usuario: any) {
    if (usuario.id === 1) {
      this.toastr.error("Não é possível excluir o Administrador do Sistema", "Erro");
      return;
    }
    this.usuarioService
      .excluir(usuario.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
