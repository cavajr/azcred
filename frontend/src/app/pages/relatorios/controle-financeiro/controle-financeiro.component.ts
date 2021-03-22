import { Component, OnInit } from "@angular/core";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../../../seguranca/auth.service";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
import { RelatoriosService } from "../relatorios.service";
defineLocale("pt-br", ptBrLocale);

@Component({
  selector: "app-controle-financeiro",
  templateUrl: "./controle-financeiro.component.html",
  styleUrls: ["./controle-financeiro.component.css"]
})
export class ControleFinanceiroComponent implements OnInit {
  blocked = false;
  tipos = [
    { label: "Receita", value: 1 },
    { label: "Despesa", value: 2 }
  ];

  formulario: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private localeService: BsLocaleService,
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
  }

  ngOnInit() {
    this.configurarFormulario();
  }

  gerar() {
    this.blocked = true;
    this.relatoriosService
      .relatorioFinanceiro(this.formulario.value)
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
      tipo: [null]
    });
  }
}
