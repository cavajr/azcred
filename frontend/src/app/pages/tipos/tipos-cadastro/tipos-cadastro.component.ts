import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { SharedService } from "./../../../shared/shared.service";
import { AuthService } from "../../../seguranca/auth.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";

import { TiposService } from "../tipos.service";
import { Tipo, TipoSistema } from "../../../core/model";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-tipos-cadastro",
  templateUrl: "./tipos-cadastro.component.html",
  styleUrls: ["./tipos-cadastro.component.css"]
})
export class TiposCadastroComponent implements OnInit {
  blocked = false;
  oculto = "oculto";

  tipo = new Tipo();

  tipoSistemaIndex: number;

  tipoSistema: TipoSistema;

  tiposSistemas = [];

  listaSistemas = [];

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private tipoService: TiposService,
    private sharedService: SharedService,
    public auth: AuthService,
    private toastr: ToastrService
  ) {
    this.carregarSistemas();
  }

  ngOnInit() {
    const idTipo = this.route.snapshot.params["id"];

    if (idTipo) {
      this.carregarTipo(idTipo);
    }
  }

  get editando() {
    return Boolean(this.tipo.id);
  }

  carregarTipo(id: number) {
    this.blocked = true;
    this.tipoService
      .buscarPorCodigo(id)
      .then(tipo => {
        this.blocked = false;
        this.tipo = tipo;
        this.carregarTiposSistemas(id);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  carregarTiposSistemas(id: number) {
    this.tipoService
      .buscarTiposSistemas(id)
      .then(tiposSistemas => {
        this.tiposSistemas = tiposSistemas;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarTipo(form);
    } else {
      this.adicionarTipo(form);
    }
  }

  adicionarTipo(form: FormControl) {
    this.tipoService
      .adicionar(this.tipo, this.tiposSistemas)
      .then(tipoAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/tipos", tipoAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarTipo(form: FormControl) {
    this.tipoService
      .atualizar(this.tipo, this.tiposSistemas)
      .then(tipo => {
        this.tipo = tipo;
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.carregarTiposSistemas(this.route.snapshot.params["id"]);
      });
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(
      function() {
        this.tipo = new Tipo();
      }.bind(this),
      1
    );
    this.router.navigate(["/tipos/novo"]);
  }

  carregarSistemas() {
    this.sharedService
      .listarSistemas()
      .then(sistema => {
        this.listaSistemas = sistema.map(b => ({
          nome: b.nome,
          id: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  prepararNovaTipo(event: any) {
    event.preventDefault();
    this.oculto = "";
    this.tipoSistema = new TipoSistema();
    this.tipoSistemaIndex = this.tiposSistemas.length;
  }

  prepararEdicaoTipo(tipoSistema: TipoSistema, index: number) {
    event.preventDefault();
    this.tipoSistema = this.clonarTipo(tipoSistema);
    this.oculto = "";
    this.tipoSistemaIndex = index;
  }

  confirmarTipo(frm: FormControl) {
    this.tiposSistemas[this.tipoSistemaIndex] = this.clonarTipo(
      this.tipoSistema
    );
    this.oculto = "oculto";
    frm.reset();
  }

  removerTipo(index: number) {
    this.tiposSistemas.splice(index, 1);
  }

  clonarTipo(tipoSistema: TipoSistema): TipoSistema {
    return new TipoSistema(
      tipoSistema.id,
      tipoSistema.tipo_id,
      tipoSistema.sistema_id,
      tipoSistema.liquido
    );
  }

  get editandoTipo() {
    return this.tipoSistema && this.tipoSistema.id;
  }
}
