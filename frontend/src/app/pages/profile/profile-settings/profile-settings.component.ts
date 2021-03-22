import { Component, OnInit } from "@angular/core";

import { ProfileService } from "./../profile.service";
import { ErrorHandlerService } from "../../../core/error-handler.service";
import { AuthService } from "../../../seguranca/auth.service";

import { Usuario } from "./../../../core/model";

import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile-settings",
  templateUrl: "./profile-settings.component.html",
  styleUrls: ["./profile-settings.component.css"]
})
export class ProfileSettingsComponent implements OnInit {
  usuario = new Usuario();
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.carregarUsuario(this.auth.jwtPayload.user.id);
  }

  ngOnInit() {}

  carregarUsuario(id: number) {
    this.profileService
      .buscarPorCodigo(id)
      .then(resultado => {
        this.usuario = resultado;
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
      this.toastr.error("O arquivo selecionado não é uma imagem", "Erro");
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
    this.profileService
      .enviarArquivo(this.imagenSubir, this.auth.jwtPayload.user.id)
      .then(resposta => {
        this.auth.imagem = resposta.arquivo;
        localStorage.setItem("imagem", JSON.stringify(resposta.arquivo));
        this.toastr.success("Imagem atualizada!", "Sucesso");
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
