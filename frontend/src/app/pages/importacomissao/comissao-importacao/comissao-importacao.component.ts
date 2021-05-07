import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { SharedService } from "../../../shared/shared.service";
import { ImportacomissaoService } from "./../importacomissao.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import swal from "sweetalert";

@Component({
  selector: "app-comissao-importacao",
  templateUrl: "./comissao-importacao.component.html",
  styleUrls: ["./comissao-importacao.component.css"]
})
export class ComissaoImportacaoComponent implements OnInit {
  formulario: FormGroup;

  imagenSubir: File;
  imagenTemp: string;
  listaBancos = [];
  listaConvenios = [];
  listaTipos = [];

  bancoSelecionado: number;

  sistema: string;
  sistemas = [
    { label: "AMX / WORK BANK", value: "AMX" },
    { label: "CEDIBRA", value: "CEDIBRA" }
  ];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private importa: ImportacomissaoService,
    private sharedService: SharedService
  ) {
    this.carregarBancos();
    this.carregarConvenios();
    this.carregarTipos();
  }

  ngOnInit() {
    this.configurarFormulario();
  }

  carregarTipos() {
    this.sharedService
      .listarTipos()
      .then(tipos => {
        this.listaTipos = tipos.map(b => ({
          label: b.nome,
          value: b.id
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarBancos() {
    this.sharedService
      .listarBancos()
      .then(bancos => {
        this.listaBancos = bancos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarConvenios() {
    this.sharedService
      .listarConvenios()
      .then(convenios => {
        this.listaConvenios = convenios;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
    this.importa
      .enviarArquivo(this.imagenSubir, this.formulario.value)
      .then(resposta => {
        if (resposta.status === "OK") {
          swal("Sucesso", "Arquivo importado com sucesso!", "success");
        }
        this.formulario.reset();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  selecionaImagem(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (
      archivo.type.indexOf(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) < 0
    ) {
      swal(
        "Somente XLSX",
        "O arquivo selecionado não é um XLSX válido",
        "error"
      );
      this.imagenSubir = null;
      this.imagenTemp = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => (this.imagenTemp = reader.result.toString());
  }

  configurarFormulario() {
    this.formulario = this.fb.group({
      sistema: [null, Validators.required],
      tipo_id: [null, Validators.required],
      banco_id: [null, Validators.required],
      convenio_id: [null, Validators.required],
      arquivo: [null, Validators.required],
      mostrarPor: [null]
    });
  }
}
