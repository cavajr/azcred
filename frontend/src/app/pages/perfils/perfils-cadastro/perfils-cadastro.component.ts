import { LazyLoadEvent } from "primeng/components/common/api";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { SharedService } from "../../../shared/shared.service";
import { AuthService } from "../../../seguranca/auth.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";

import { PerfilsService } from "../perfils.service";
import { Perfil, PerfilComissao } from "../../../core/model";

import { ToastrService } from "ngx-toastr";

export class ComissaoFiltro {
  pagina = 0;
  itensPorPagina = 10;
}

@Component({
  selector: "app-perfils-cadastro",
  templateUrl: "./perfils-cadastro.component.html",
  styleUrls: ["./perfils-cadastro.component.css"]
})
export class PerfilsCadastroComponent implements OnInit {
  blocked = false;

  perfil = new Perfil();

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private perfilService: PerfilsService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  salvar(form: FormControl) {
    this.adicionarPerfil(form);
  }

  adicionarPerfil(form: FormControl) {
    this.perfilService
      .adicionar(this.perfil)
      .then(perfilAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/perfils", perfilAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(
      function() {
        this.perfil = new Perfil();
      }.bind(this),
      1
    );
    this.router.navigate(["/perfils/novo"]);
  }
}
