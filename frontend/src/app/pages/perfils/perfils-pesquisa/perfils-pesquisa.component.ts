import { Component, OnInit, ViewChild } from "@angular/core";

import { ConfirmationService } from "primeng/components/common/api";
import { LazyLoadEvent } from "primeng/components/common/api";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { PerfilFiltro, PerfilsService } from "../perfils.service";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-perfils-pesquisa",
  templateUrl: "./perfils-pesquisa.component.html",
  styleUrls: ["./perfils-pesquisa.component.css"]
})
export class PerfilsPesquisaComponent implements OnInit {
  filtro = new PerfilFiltro();
  totalRegistros = 0;
  perfils = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private perfilsService: PerfilsService,
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
    this.perfilsService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.perfils = resultado.perfils;
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
}
