import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

import { ConfiguracaoService } from "../configuracao.service";
import { ErrorHandlerService } from "./../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";
import { Config } from "./../../../core/model";

import swal from "sweetalert";

@Component({
  selector: "app-configuracao-settings",
  templateUrl: "./configuracao-settings.component.html",
  styleUrls: ["./configuracao-settings.component.css"]
})
export class ConfiguracaoSettingsComponent implements OnInit {
  config = new Config();
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private configService: ConfiguracaoService
  ) {
    this.carregarConfig(1);
  }

  ngOnInit() {}

  carregarConfig(id: number) {
    this.configService
      .buscarPorCodigo(id)
      .then(resultado => {
        this.config = resultado;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  selecionaImagem(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf("image") < 0) {
      swal(
        "Somente Imagens",
        "O arquivo selecionado não é uma imagem",
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

  onUpload() {
    this.configService
      .enviarArquivo(this.imagenSubir, 1)
      .then(resposta => {
        swal("Sucesso", "Imagem atualizada!", "success");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
    this.configService
      .salvar(this.config)
      .then(config => {
        this.config = config;
        swal("Sucesso", "Registro alterado com sucesso!", "success");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
