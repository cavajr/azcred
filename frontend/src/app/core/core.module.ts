import { NgModule, LOCALE_ID } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule, registerLocaleData } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import localePt from "@angular/common/locales/pt";

// Terceiros
import { JwtHelperService } from "@auth0/angular-jwt";

import { ErrorHandlerService } from "./error-handler.service";

import { SistemaHttp } from "../seguranca/sistema-http";

import { PipesModule } from "../pipes/pipes.module";

import { NaoAutorizadoComponent } from "./nao-autorizado/nao-autorizado.component";
import { PaginaNaoEncontradaComponent } from "./pagina-nao-encontrada/pagina-nao-encontrada.component";

registerLocaleData(localePt);

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, PipesModule],
  declarations: [PaginaNaoEncontradaComponent, NaoAutorizadoComponent],
  exports: [PaginaNaoEncontradaComponent, NaoAutorizadoComponent],
  providers: [
    ErrorHandlerService,
    JwtHelperService,
    { provide: LOCALE_ID, useValue: "pt" },
    SistemaHttp
  ]
})
export class CoreModule {}
