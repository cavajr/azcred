import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ErrorHandlerService } from "../../../core/error-handler.service";

import { AuthService } from "../../../seguranca/auth.service";
import { CorretoresService } from "../corretores.service";
import { Corretor, CorretorAcesso } from "../../../core/model";

import swal from "sweetalert";

@Component({
  selector: "app-corretores-acessos",
  templateUrl: "./corretores-acessos.component.html",
  styleUrls: ["./corretores-acessos.component.css"]
})
export class CorretoresAcessosComponent implements OnInit {
  blocked = false;
  oculto = "oculto";
  acessoIndex: number;

  corretorAcesso: CorretorAcesso;

  acessos = [];

  corretor = new Corretor();

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private corretorService: CorretoresService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const idCorretor = this.auth.jwtPayload.user.corretor_id;
    if (idCorretor) {
      this.carregarCorretor(idCorretor);
    }
  }

  get editando() {
    return Boolean(this.corretor.id);
  }

  carregarCorretor(id: number) {
    this.blocked = true;
    this.corretorService
      .buscarPorCodigo(id)
      .then(corretor => {
        this.blocked = false;
        this.corretor = corretor;
        this.acessos = corretor.acessos;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  salvar(form: FormControl) {
    this.corretor.acessos = this.acessos;
    if (this.editando) {
      this.atualizar(form);
    }
  }

  atualizar(form: FormControl) {
    this.corretorService
      .atualizarAcesso(this.corretor)
      .then(corretor => {
        swal("Sucesso", "Registro alterado com sucesso!", "success");
        this.corretor = corretor;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  prepararNovaConta(event: any) {
    event.preventDefault();
    this.oculto = "";
    this.corretorAcesso = new CorretorAcesso();
    this.acessoIndex = this.acessos.length;
  }

  prepararEdicaoConta(acesso: CorretorAcesso, index: number) {
    event.preventDefault();
    this.corretorAcesso = this.clonarConta(acesso);
    this.oculto = "";
    this.acessoIndex = index;
  }

  confirmarConta(frm: FormControl) {
    this.acessos[this.acessoIndex] = this.clonarConta(this.corretorAcesso);
    this.oculto = "oculto";
    frm.reset();
  }

  removerConta(index: number) {
    this.acessos.splice(index, 1);
  }

  clonarConta(acesso: CorretorAcesso): CorretorAcesso {
    return new CorretorAcesso(
      acesso.id,
      acesso.banco,
      acesso.usuario,
      acesso.senha,
      acesso.codigo_agente,
      acesso.operador
    );
  }

  get editandoConta() {
    return this.corretorAcesso && this.corretorAcesso.id;
  }
}
