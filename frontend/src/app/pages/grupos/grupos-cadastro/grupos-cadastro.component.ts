import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { AuthService } from "./../../../seguranca/auth.service";
import { PermissoesService } from "./../../permissoes/permissoes.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { GruposService } from "./../grupos.service";
import { Grupo, Permissao } from "./../../../core/model";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-grupos-cadastro",
  templateUrl: "./grupos-cadastro.component.html",
  styleUrls: ["./grupos-cadastro.component.css"]
})
export class GruposCadastroComponent implements OnInit {
  blocked = false;
  grupo = new Grupo();

  selecionados: Permissao[];
  permissoes: Permissao[];

  cols = [
    { field: "nome", header: "Nome" },
    { field: "descricao", header: "Descrição" }
  ];

  constructor(
    private grupoService: GruposService,
    private permissoesService: PermissoesService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.carregarPermissoes();
    const idGrupo = this.route.snapshot.params["id"];
    if (idGrupo) {
      this.carregarGrupo(idGrupo);
    }
  }

  get editando() {
    return Boolean(this.grupo.id);
  }

  carregarPermissoes() {
    this.permissoesService
      .listarPermissoes()
      .then(permissoes => {
        this.permissoes = permissoes;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.selecionados) {
      this.grupo.permissoes = this.selecionados
        .filter(x => x.nome)
        .map(x => x.nome);
    }
    if (this.editando) {
      this.atualizarGrupo(form);
    } else {
      this.adicionarGrupo(form);
    }
  }

  carregarGrupo(id: number) {
    this.blocked = true;
    this.grupoService
      .buscarPorCodigo(id)
      .then(resultado => {
        this.blocked = false;
        this.grupo = resultado.grupo;
        this.selecionados = resultado.permissoes;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  adicionarGrupo(form: FormControl) {
    this.grupoService
      .adicionar(this.grupo)
      .then(grupoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/grupos", grupoAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarGrupo(form: FormControl) {
    this.grupoService
      .atualizar(this.grupo)
      .then(grupo => {
        this.grupo = grupo;
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(
      function() {
        this.grupo = new Grupo();
      }.bind(this),
      1
    );

    this.router.navigate(["/grupos/novo"]);
  }
}
