import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "../../core/error-handler.service";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  logomarca: string;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.carregarConfig(1);
  }

  login(usuario: string, senha: string) {
    this.auth
      .login(usuario, senha)
      .then(() => {
        this.router.navigate(["/dashboard"]);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  carregarConfig(id: number) {
    this.auth
      .buscarLogoPorCodigo(id)
      .then(resultado => {
        this.logomarca = resultado.logo;
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }
}
