import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { PermissoesService } from "../permissoes.service";
import { AuthService } from "./../../../seguranca/auth.service";
import { Permissao } from "../../../core/model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-permissoes-cadastro",
  templateUrl: "./permissoes-cadastro.component.html",
  styleUrls: ["./permissoes-cadastro.component.css"]
})
export class PermissoesCadastroComponent implements OnInit {
  blocked = false;

  permissao = new Permissao();

  constructor(
    private permissaoService: PermissoesService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const idPermissao = this.route.snapshot.params["id"];
    if (idPermissao) {
      this.carregarPermissao(idPermissao);
    }
  }

  get editando() {
    return Boolean(this.permissao.id);
  }

  carregarPermissao(id: number) {
    this.blocked = true;
    this.permissaoService
      .buscarPorCodigo(id)
      .then(permissao => {
        this.blocked = false;
        this.permissao = permissao;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPermissao(form);
    } else {
      this.adicionarPermissao(form);
    }
  }

  adicionarPermissao(form: FormControl) {
    this.permissaoService
      .adicionar(this.permissao)
      .then(permissaoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/permissoes", permissaoAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPermissao(form: FormControl) {
    this.permissaoService
      .atualizar(this.permissao)
      .then(permissao => {
        this.permissao = permissao;
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(
      function() {
        this.permissao = new Permissao();
      }.bind(this),
      1
    );

    this.router.navigate(["/permissoes/novo"]);
  }
}
