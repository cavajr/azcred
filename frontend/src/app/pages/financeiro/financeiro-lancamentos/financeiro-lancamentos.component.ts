import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { FinanceiroService } from "../financeiro.service";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";
defineLocale("pt-br", ptBrLocale);
ptBrLocale.invalidDate = "Data inválida";

import swal from "sweetalert";

@Component({
  selector: "app-financeiro-lancamentos",
  templateUrl: "./financeiro-lancamentos.component.html",
  styleUrls: ["./financeiro-lancamentos.component.css"]
})
export class FinanceiroLancamentosComponent implements OnInit {
  blocked = false;
  tipos = [{ label: "Receita", value: 1 }, { label: "Despesa", value: 2 }];
  formulario: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private financeiroService: FinanceiroService,
    public auth: AuthService,
    private localeService: BsLocaleService
  ) {
    // Datapicker Configuração
    this.localeService.use("pt-br");
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: "theme-dark-blue",
        dateInputFormat: "DD/MM/YYYY",
        showWeekNumbers: false
      }
    );
  }

  ngOnInit() {
    this.configurarFormulario();
    const idlanc = this.route.snapshot.params["id"];

    if (idlanc) {
      this.carregar(idlanc);
    }
  }

  configurarFormulario() {
    this.formulario = this.fb.group({
      id: [],
      tipo: [null, Validators.required],
      nome: [null, Validators.required],
      data_mov: [null, Validators.required],
      valor: [null, Validators.required],
      descricao: [null, Validators.required]
    });
  }

  get editando() {
    return Boolean(this.formulario.get("id").value);
  }

  carregar(id: number) {
    this.blocked = true;
    this.financeiroService
      .buscarPorCodigo(id)
      .then(financeiro => {
        this.blocked = false;
        this.formulario.patchValue(financeiro);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  salvar() {
    if (this.editando) {
      this.atualizar();
    } else {
      this.adicionar();
    }
  }

  adicionar() {
    this.financeiroService
      .adicionar(this.formulario.value)
      .then(lancAdicionado => {
        swal("Sucesso", "Registro adicionado com sucesso!", "success");
        this.router.navigate(["/financeiro", lancAdicionado.id]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizar() {
    this.financeiroService
      .atualizar(this.formulario.value)
      .then(financeiro => {
        swal("Sucesso", "Registro alterado com sucesso!", "success");
        this.formulario.patchValue(financeiro);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();
    this.router.navigate(["/financeiro/novo"]);
  }
}
