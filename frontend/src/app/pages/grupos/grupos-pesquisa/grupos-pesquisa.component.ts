import { Component, OnInit, ViewChild } from "@angular/core";

import { AuthService } from "./../../../seguranca/auth.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { GruposService, GrupoFiltro } from "./../grupos.service";
import { LazyLoadEvent } from "primeng/components/common/api";

import { ToastrService } from "ngx-toastr";
import swal from "sweetalert";

@Component({
  selector: "app-grupos-pesquisa",
  templateUrl: "./grupos-pesquisa.component.html",
  styleUrls: ["./grupos-pesquisa.component.css"]
})
export class GruposPesquisaComponent implements OnInit {
  filtro = new GrupoFiltro();
  totalRegistros = 0;
  grupos = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private grupoService: GruposService,
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
    this.grupoService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.grupos = resultado.grupos;
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

  confirmarExclusao(grupo: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(grupo);
      }
    });
  }

  excluir(grupo: any) {
    this.grupoService
      .excluir(grupo.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
