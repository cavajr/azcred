import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";

import { PerfilsCadastroComponent } from "./perfils-cadastro/perfils-cadastro.component";
import { PerfilsEditarComponent } from "./perfils-editar/perfils-editar.component";
import { PerfilsPesquisaComponent } from "./perfils-pesquisa/perfils-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: PerfilsPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_COMISSAO"], title: "Perfis de Comissão" }
  },
  {
    path: "novo",
    component: PerfilsCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_COMISSAO"], title: "Perfis de Comissão" }
  },
  {
    path: ":id",
    component: PerfilsEditarComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_COMISSAO"], title: "Perfis de Comissão" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilsRoutingModule {}
