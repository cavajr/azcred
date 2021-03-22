import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl } from "@angular/forms";

import { UsuariosService } from "../usuarios.service";
import { AuthService } from "./../../../seguranca/auth.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";

import { Usuario, Grupo } from "./../../../core/model";
import { CorretoresService } from "../../corretores/corretores.service";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

@Component({
  selector: "app-usuarios-cadastro",
  templateUrl: "./usuarios-cadastro.component.html",
  styleUrls: ["./usuarios-cadastro.component.css"]
})
export class UsuariosCadastroComponent implements OnInit {
  blocked = false;
  usuario = new Usuario();
  externo = [
    { label: "SIM", value: 1 },
    { label: "NÃO", value: 0 }
  ];

  ativos = [
    { label: "SIM", value: 1 },
    { label: "NÃO", value: 0 }
  ];

  selecionados: Grupo[];
  grupos: Grupo[];

  listaCorretores = [];

  cols = [
    { field: "nome", header: "Nome" },
    { field: "descricao", header: "Descrição" }
  ];

  constructor(
    private usuarioService: UsuariosService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private corretorService: CorretoresService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.carregarCorretores();
    this.carregarGrupos();
    const idUsuario = this.route.snapshot.params["id"];
    if (idUsuario) {
      this.carregarUsuario(idUsuario);
    }
  }

  get editando() {
    return Boolean(this.usuario.id);
  }

  carregarUsuario(id: number) {
    this.blocked = true;
    this.usuarioService
      .buscarPorCodigo(id)
      .then(resultado => {
        this.blocked = false;
        let result = resultado;
        this.usuario = result.usuario;
        this.selecionados = result.papeis;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  carregarGrupos() {
    this.usuarioService
      .listarGrupos()
      .then(grupos => {
        this.grupos = grupos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCorretores() {
    this.corretorService
      .listarAtivos()
      .then(corretores => {
        this.listaCorretores = corretores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  validCorretor() {
    if ((this.usuario.acesso_externo === 1) && (!this.usuario.hasOwnProperty('corretor_id'))) {
      swal("Erro", "Favor selecionar um corretor!", "error");
      return false;
    } else {
      return true;
    }
  }

  salvar(form: FormControl) {
    if (this.validCorretor()) {
      if (this.selecionados) {
        this.usuario.papeis = this.selecionados
          .filter(x => x.nome)
          .map(x => x.nome);
      }
      if (this.editando) {
        this.atualizarUsuario(form);
      } else {
        this.adicionarUsuario(form);
      }
    }
  }

  atualizarUsuario(form: FormControl) {
    this.usuarioService
      .atualizar(this.usuario)
      .then(usuario => {
        this.usuario = usuario;
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  adicionarUsuario(form: FormControl) {
    this.usuarioService
      .adicionar(this.usuario)
      .then(usuarioAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/usuarios", usuarioAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(
      function() {
        this.usuario = new Usuario();
      }.bind(this),
      1
    );

    this.router.navigate(["/usuarios/novo"]);
  }
}
