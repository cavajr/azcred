import { Component, OnInit, ViewChild } from "@angular/core";

import { CorretoresService, CorretorFiltro } from "../corretores.service";

import { LazyLoadEvent } from "primeng/api";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

@Component({
  selector: "app-corretores-pesquisa",
  templateUrl: "./corretores-pesquisa.component.html",
  styleUrls: ["./corretores-pesquisa.component.css"]
})
export class CorretoresPesquisaComponent implements OnInit {
  filtro = new CorretorFiltro();
  totalRegistros = 0;
  corretores = [];
  @ViewChild("tabela")
  grid;

  loading: boolean;

  constructor(
    private corretoresService: CorretoresService,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
  }

  pesquisar(pagina = 0) {
    this.loading = true;
    this.filtro.pagina = pagina + 1;
    this.corretoresService
      .pesquisar(this.filtro)
      .then(resultado => {
        this.loading = false;
        this.totalRegistros = resultado.total;
        this.corretores = resultado.corretores;
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
