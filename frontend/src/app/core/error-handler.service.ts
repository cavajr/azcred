import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { NotAuthenticatedError } from "./../seguranca/sistema-http";

import swal from "sweetalert";

@Injectable()
export class ErrorHandlerService {
  constructor(private router: Router) {}

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === "string") {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = "Sua sessão expirou!";
      this.router.navigate(["/login"]);
    } else if (errorResponse.status === 422) {
      msg = errorResponse.error;
      console.log(errorResponse);
    } else if (errorResponse instanceof Response && errorResponse.status >= 400 && errorResponse.status <= 499) {
      let errors;
      msg = "Ocorreu um erro ao processar a sua solicitação";
      if (errorResponse.status === 403) {
        msg = "Você não tem permissão para executar esta ação";
      }
      try {
        errors = errorResponse.json();
        msg = errors[0].error;
      } catch (e) {}
    } else {
      msg = "Erro ao processar serviço remoto. Tente novamente.";
    }
    swal("Erro", msg, "error");
  }
}
