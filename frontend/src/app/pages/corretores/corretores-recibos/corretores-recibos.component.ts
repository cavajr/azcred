import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { SharedService } from "../../../shared/shared.service";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
import { CorretoresService } from "../corretores.service";
ptBrLocale.invalidDate = "Data inválida";
defineLocale("pt-br", ptBrLocale);

import swal from "sweetalert";

@Component({
  selector: "app-corretores-recibos",
  templateUrl: "./corretores-recibos.component.html",
  styleUrls: ["./corretores-recibos.component.css"]
})
export class CorretoresRecibosComponent implements OnInit {
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
    private corretoresService: CorretoresService
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
    this.carregarCorretor(this.auth.jwtPayload.user.corretor_id);
    this.configurarFormulario();
    this.formulario.controls.promotor_id.patchValue(
      this.auth.jwtPayload.user.corretor_id
    );
  }

  carregarCorretor(id: number) {
    this.corretoresService
      .buscarPorCodigo(id)
      .then(corretor => {
        this.formulario.controls.promotor.patchValue(corretor.nome);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  gerar() {
    this.blocked = true;
    this.corretoresService.relatorioRecibos(this.formulario.value).subscribe(
      relatorio => {
        this.blocked = false;
        let file = new Blob([relatorio], { type: "application/pdf" });
        const url = window.URL.createObjectURL(file);
        window.open(url);
      },
      error => {
        this.blocked = false;
        if (error.status === 404) {
          swal(
            "Atenção",
            "Nenhum dado encontrado para esse período !",
            "warning"
          );
        }
      }
    );
  }

  configurarFormulario() {
    this.formulario = this.fb.group({
      de: [null, Validators.required],
      ate: [null, Validators.required],
      promotor_id: [{ value: this.auth.jwtPayload.user.id }],
      promotor: [null]
    });
  }
}
