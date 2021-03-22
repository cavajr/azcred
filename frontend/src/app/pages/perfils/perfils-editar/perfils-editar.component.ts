import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../../seguranca/auth.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";

import { PerfilsService } from "../perfils.service";
import { Perfil, PerfilComissao } from "../../../core/model";

import { ToastrService } from "ngx-toastr";

import swal from "sweetalert";

export class ComissaoFiltro {
  pagina = 0;
  itensPorPagina = 10;
}

@Component({
  selector: "app-perfils-editar",
  templateUrl: "./perfils-editar.component.html",
  styleUrls: ["./perfils-editar.component.css"]
})
export class PerfilsEditarComponent implements OnInit {
  blocked = false;
  loading: boolean;
  oculto = "oculto";
  media = 0.0;

  perfil = new Perfil();

  perfilComissao: PerfilComissao;

  perfilComissaoIndex: number;

  perfilComissoes = [];

  totalRegistros = 0;
  @ViewChild("tabela")
  grid;

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private perfilsService: PerfilsService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = false;
    const idPerfil = this.route.snapshot.params["id"];

    if (idPerfil) {
      this.carregarPerfil(idPerfil);
    }
  }

  carregarPerfil(id: number) {
    this.blocked = true;
    this.perfilsService
      .buscarPorCodigo(id)
      .then(perfil => {
        this.blocked = false;
        this.perfil = perfil;
        this.carregarPerfilComissao(id);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  carregarPerfilComissao(id: number) {
    this.perfilsService
      .buscarPerfilComissao(id)
      .then(resultado => {
        this.media = resultado.media;
        this.perfilComissoes = resultado.perfilsComissoes;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  salvar(form: FormControl) {
    this.atualizarPerfil(form);
  }

  atualizarPerfil(form: FormControl) {
    this.perfilsService
      .atualizar(this.perfil, this.perfilComissoes)
      .then(perfil => {
        this.perfil = perfil;
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.carregarPerfilComissao(this.route.snapshot.params["id"]);
      });
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

  prepararNovaComissao(event: any) {
    event.preventDefault();
    this.oculto = "";
    this.perfilComissao = new PerfilComissao();
    this.perfilComissaoIndex = this.perfilComissoes.length;
  }

  prepararEdicaoComissao(perfilComissao: PerfilComissao, index: number) {
    event.preventDefault();
    this.perfilComissao = this.clonarComissao(perfilComissao);
    this.oculto = "";
    this.perfilComissaoIndex = index;
  }

  confirmarComissao(frm: FormControl) {
    this.perfilComissoes[this.perfilComissaoIndex] = this.clonarComissao(
      this.perfilComissao
    );
    this.oculto = "oculto";
    frm.reset();
  }

  removerComissao(index: number) {
    this.perfilComissoes.splice(index, 1);
  }

  clonarComissao(perfilComissao: PerfilComissao): PerfilComissao {
    return new PerfilComissao(
      perfilComissao.id,
      perfilComissao.real_percentual,
      perfilComissao.perc_pago_inicio,
      perfilComissao.perc_pago_fim,
      perfilComissao.comissao,
      perfilComissao.perfil_id
    );
  }

  get editandoComissao() {
    return this.perfilComissao && this.perfilComissao.id;
  }
}
