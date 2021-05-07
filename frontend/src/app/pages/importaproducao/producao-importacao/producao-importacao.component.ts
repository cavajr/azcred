import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "../../../seguranca/auth.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { ImportaproducaoService } from "../importaproducao.service";

import swal from "sweetalert";

@Component({
  selector: "app-producao-importacao",
  templateUrl: "./producao-importacao.component.html",
  styleUrls: ["./producao-importacao.component.css"]
})
export class ProducaoImportacaoComponent implements OnInit {
  formulario: FormGroup;

  imagenSubir: File;
  imagenTemp: string;

  sistema: string;
  sistemas = [
    { label: "AMX / WORK BANK", value: "AMX" },
    { label: "CEDIBRA", value: "CEDIBRA" },
    { label: "FONTES / STORM", value: "STORM" }
  ];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private importa: ImportaproducaoService
  ) {}

  ngOnInit() {
    this.configurarFormulario();
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
      arquivo: [null, Validators.required]
    });
  }
}
