import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";

import { TiposCadastroComponent } from "./tipos-cadastro/tipos-cadastro.component";
import { TiposPesquisaComponent } from "./tipos-pesquisa/tipos-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: TiposPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_TIPO_CONTRATO"], title: "Tipos de contrato" }
  },
  {
    path: "novo",
    component: TiposCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_TIPO_CONTRATO"], title: "Tipos de contrato" }
  },
  {
    path: ":id",
    component: TiposCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_TIPO_CONTRATO"], title: "Tipos de contrato" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposRoutingModule {}
