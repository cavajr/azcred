import { Component, OnInit, ViewChild } from "@angular/core";

import { AuthService } from "../../../seguranca/auth.service";
import { PermissaoFiltro, PermissoesService } from "../permissoes.service";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { LazyLoadEvent } from "../../../../../node_modules/primeng/components/common/api";
import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-permissoes-pesquisa",
  templateUrl: "./permissoes-pesquisa.component.html",
  styleUrls: ["./permissoes-pesquisa.component.css"]
})
export class PermissoesPesquisaComponent implements OnInit {
  filtro = new PermissaoFiltro();
  totalRegistros = 0;
  permissoes = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private permissoesService: PermissoesService,
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
    this.permissoesService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.permissoes = resultado.permissoes;
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

  confirmarExclusao(permissao: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(permissao);
      }
    });
  }

  excluir(permissao: any) {
    this.permissoesService
      .excluir(permissao.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
