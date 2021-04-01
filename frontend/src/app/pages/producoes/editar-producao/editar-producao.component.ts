import { SharedService } from "./../../../shared/shared.service";
import { ProducoesService } from "./../producoes.service";
import { CorretoresService } from "./../../corretores/corretores.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { defineLocale } from "ngx-bootstrap/chronos";
import { ptBrLocale } from "ngx-bootstrap/locale";
ptBrLocale.invalidDate = "Data inválida";
import { BsLocaleService, BsDatepickerConfig } from "ngx-bootstrap/datepicker";
defineLocale("pt-br", ptBrLocale);

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-editar-producao",
  templateUrl: "./editar-producao.component.html",
  styleUrls: ["./editar-producao.component.css"]
})
export class EditarProducaoComponent implements OnInit {
  blocked = false;

  fisicopendente = [
    { label: "Sim", value: "S" },
    { label: "Não", value: "N" }
  ];

  formulario: FormGroup;

  bsConfig: Partial<BsDatepickerConfig>;

  listaCorretores = [];

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private corretoresService: CorretoresService,
    private producoesService: ProducoesService,
    private localeService: BsLocaleService,
    private toastr: ToastrService
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
    const idContrato = this.route.snapshot.params["id"];
    if (idContrato) {
      this.carregarContrato(idContrato);
    }
    this.formulario.controls["corretor_perc_comissao"].valueChanges.subscribe(
      change => {
        if (this.formulario.controls["em_real"].value == 1) {
          let perc_comissao =
            this.formulario.get("perc_comissao").value -
            this.formulario.get("corretor_perc_comissao").value;
            this.formulario.patchValue({
              correspondente_perc_comissao: perc_comissao
            });
        }
      }
    );
    this.formulario.controls["corretor_valor_comissao"].valueChanges.subscribe(
      change => {
        if (this.formulario.controls["em_real"].value == 0) {
          let perc_comissao =
            this.formulario.get("valor_contrato").value -
            this.formulario.get("corretor_valor_comissao").value;
            this.formulario.patchValue({
              correspondente_valor_comissao: perc_comissao
            });
        }
      }
    );
  }

  ajustaComissao(event) {
    this.blocked = true;
    if (this.formulario.controls["corretor_id"].value) {
      this.producoesService
        .retornaComissao(
          this.formulario.controls["corretor_id"].value,
          this.formulario.controls["id"].value,
          event
        )
        .then(comissao => {
          this.blocked = false;
          if (event == 1){
            this.formulario.patchValue({ corretor_perc_comissao: comissao });
          } else {
            this.formulario.patchValue({ corretor_valor_comissao: comissao });
          }
        })
        .catch(erro => {
          this.blocked = false;
          this.errorHandler.handle(erro);
        });
    } else {
      this.blocked = false;
      this.formulario.patchValue({ corretor_perc_comissao: 0.00 });

    }
  }

  retornaComissao(event) {
    this.blocked = true;
    this.producoesService
      .retornaComissao(
        event,
        this.formulario.controls["id"].value,
        this.formulario.controls["em_real"].value
      )
      .then(comissao => {
        this.blocked = false;
        if (this.formulario.controls["em_real"].value == 1) {
          this.formulario.patchValue({ corretor_perc_comissao: comissao });
        } else {
          this.formulario.patchValue({ corretor_valor_comissao: comissao });
        }
      })
      .catch(erro => {
        this.blocked = false;
        this.errorHandler.handle(erro);
      });
  }

  carregarCorretores() {
    this.corretoresService
      .listarCorretores()
      .then(corretores => {
        this.listaCorretores = corretores;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  configurarFormulario() {
    this.formulario = this.fb.group({
      id: [],
      proposta: [],
      contrato: [],
      cpf: [],
      cliente: [],
      prazo: [],
      produto: [],
      tabela: [],
      banco: [],
      valor_contrato: [],
      pago: [],
      em_real: [1, Validators.required],
      valor_comissao: [],
      perc_comissao: [],
      correspondente_perc_comissao: [],
      correspondente_valor_comissao: [],
      corretor_valor_comissao: [],
      corretor_perc_comissao: [null, Validators.required],
      corretor_id: [null, Validators.required],
      fisicopendente: [null, Validators.required],
      data_fisico: [null, Validators.required],
      data_operacao: [],
      data_credito_cliente: [],
      data_ncr: [],
      usuario: []
    });
  }

  carregarContrato(id: number) {
    this.blocked = true;
    this.producoesService
      .buscarPorCodigo(id)
      .then(contrato => {
        this.blocked = false;
        this.formulario.patchValue(contrato);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
        this.blocked = false;
      });
  }

  salvar() {
    this.atualizarContrato();
  }

  atualizarContrato() {
    this.producoesService
      .atualizar(this.formulario.value)
      .then(contrato => {
        this.toastr.success("Registro alterado com sucesso!", "Sucesso");
        this.formulario.patchValue(contrato);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  onSearchChange(event) {
    console.log(event);
  }
}
