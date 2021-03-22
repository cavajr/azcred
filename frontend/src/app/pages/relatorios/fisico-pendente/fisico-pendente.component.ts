import { SharedService } from "./../../../shared/shared.service";
import { AuthService } from "./../../../seguranca/auth.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { RelatoriosService } from "../relatorios.service";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

@Component({
  selector: "app-fisico-pendente",
  templateUrl: "./fisico-pendente.component.html",
  styleUrls: ["./fisico-pendente.component.css"]
})
export class FisicoPendenteComponent implements OnInit {
  blocked = false;
  formulario: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  listaCorretores = [];

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService,
    private localeService: BsLocaleService,
    private sharedService: SharedService,
    private relatoriosService: RelatoriosService
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
    this.carregarCorretores();
  }

  ngOnInit() {
    this.configurarFormulario();
  }

  carregarCorretores() {
    this.sharedService
      .listarCorretores()
      .then(corretores => {
        this.listaCorretores = corretores.map(b => ({
          label: b.nome,
          value: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  gerar() {
    this.blocked = true;
    this.relatoriosService
      .relatorioFisicoPendente(this.formulario.value)
      .subscribe(relatorio => {
        this.blocked = false;
        let file = new Blob([relatorio], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      });
  }

  configurarFormulario() {
    this.formulario = this.fb.group({
      de: [null, Validators.required],
      ate: [null, Validators.required],
      promotor_id: [null]
    });
  }
}
