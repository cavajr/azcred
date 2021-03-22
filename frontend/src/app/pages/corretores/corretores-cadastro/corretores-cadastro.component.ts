import { PerfilsService } from "./../../perfils/perfils.service";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ErrorHandlerService } from "../../../core/error-handler.service";

import { AuthService } from "../../../seguranca/auth.service";
import { CorretoresService } from "../corretores.service";
import { ContasService } from "../../contas/contas.service";
import { BancospgService } from "../../bancospg/bancospg.service";
import { Corretor, CorretorAcesso } from "../../../core/model";

import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
import { defineLocale } from "ngx-bootstrap/chronos";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

defineLocale("pt-br", ptBrLocale);

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-corretores-cadastro",
  templateUrl: "./corretores-cadastro.component.html",
  styleUrls: ["./corretores-cadastro.component.css"]
})
export class CorretoresCadastroComponent implements OnInit {
  blocked = false;
  oculto = "oculto";
  acessoIndex: number;

  corretorAcesso: CorretorAcesso;

  pessoas = [
    { label: "FÍSICA", value: "F" },
    { label: "JURÍDICA", value: "J" }
  ];

  ufs: any;
  bsConfig: Partial<BsDatepickerConfig>;

  contas = [];
  bancos = [];
  acessos = [];
  perfis = [];

  corretor = new Corretor();

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private corretorService: CorretoresService,
    private localeService: BsLocaleService,
    public auth: AuthService,
    private contasService: ContasService,
    private perfisService: PerfilsService,
    private bancospgService: BancospgService,
    private toastr: ToastrService
  ) {
    this.localeService.use("pt-br");
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-dark-blue",
        dateInputFormat: "DD/MM/YYYY",
        showWeekNumbers: false
      }
    );

    this.ufs = [
      { label: "AC", value: "AC" },
      { label: "AL", value: "AL" },
      { label: "AM", value: "AM" },
      { label: "AP", value: "AP" },
      { label: "BA", value: "BA" },
      { label: "CE", value: "CE" },
      { label: "DF", value: "DF" },
      { label: "ES", value: "ES" },
      { label: "GO", value: "GO" },
      { label: "MA", value: "MA" },
      { label: "MT", value: "MT" },
      { label: "MS", value: "MS" },
      { label: "MG", value: "MG" },
      { label: "PA", value: "PA" },
      { label: "PB", value: "PB" },
      { label: "PR", value: "PR" },
      { label: "PE", value: "PE" },
      { label: "PI", value: "PI" },
      { label: "RJ", value: "RJ" },
      { label: "RN", value: "RN" },
      { label: "RO", value: "RO" },
      { label: "RS", value: "RS" },
      { label: "RR", value: "RR" },
      { label: "SC", value: "SC" },
      { label: "SE", value: "SE" },
      { label: "SP", value: "SP" },
      { label: "TO", value: "TO" }
    ];
  }

  onChange(event) {
    this.corretor.cpf = null;
  }

  ngOnInit() {
    const idCorretor = this.route.snapshot.params["id"];
    if (idCorretor) {
      this.carregarCorretor(idCorretor);
    }
    this.carregarTipoContas();
    this.carregarBancos();
    this.carregarPerfis();
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

  carregarTipoContas() {
    this.contasService
      .listarAll()
      .then(contas => {
        this.contas = contas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPerfis() {
    this.perfisService
      .listarAll()
      .then(perfis => {
        this.perfis = perfis;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarBancos() {
    this.bancospgService
      .listarAll()
      .then(bancos => {
        this.bancos = bancos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.corretor.acessos = this.acessos;
    if (this.editando) {
      this.atualizar(form);
    } else {
      this.adicionar(form);
    }
  }

  adicionar(form: FormControl) {
    this.corretor.ativo = "S";
    this.corretorService
      .adicionar(this.corretor)
      .then(corretorAdicionado => {
        this.toastr.success("Registro adicionado com sucesso!", "Sucesso");
        this.router.navigate(["/corretores", corretorAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar(form: FormControl) {
    this.corretorService
      .atualizar(this.corretor)
      .then(corretor => {
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
        this.corretor = corretor;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(
      function() {
        this.corretor = new Corretor();
      }.bind(this),
      1
    );
    this.router.navigate(["/corretores/novo"]);
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
