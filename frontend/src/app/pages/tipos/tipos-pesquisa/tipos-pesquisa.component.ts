import { Component, OnInit, ViewChild } from "@angular/core";

import { ConfirmationService } from "primeng/components/common/api";
import { LazyLoadEvent } from "primeng/components/common/api";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { TipoFiltro, TiposService } from "./../tipos.service";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-tipos-pesquisa",
  templateUrl: "./tipos-pesquisa.component.html",
  styleUrls: ["./tipos-pesquisa.component.css"]
})
export class TiposPesquisaComponent implements OnInit {
  filtro = new TipoFiltro();
  totalRegistros = 0;
  tipos = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private tipoService: TiposService,
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
    this.tipoService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.tipos = resultado.tipos;
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

  confirmarExclusao(tipo: any) {
    swal({
      title: "Tem certeza que deseja excluir?",
      text: "Você não poderá reverter essa ação!",
      icon: "warning",
      buttons: ["Não", "Sim"],
      dangerMode: true
    }).then(result => {
      if (result) {
        this.excluir(tipo);
      }
    });
  }

  excluir(tipo: any) {
    this.tipoService
      .excluir(tipo.id)
      .then(() => {
        this.grid.first = 0;
        this.pesquisar(0);
        this.toastr.success("Registro excluído com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
