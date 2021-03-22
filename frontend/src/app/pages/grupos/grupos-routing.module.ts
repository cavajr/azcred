import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";

import { GruposPesquisaComponent } from "./grupos-pesquisa/grupos-pesquisa.component";
import { GruposCadastroComponent } from "./grupos-cadastro/grupos-cadastro.component";

const routes: Routes = [
  {
    path: "",
    component: GruposPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_GRUPO"], title: "Grupos" }
  },
  {
    path: "novo",
    component: GruposCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_GRUPO"], title: "Grupos" }
  },
  {
    path: ":id",
    component: GruposCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_GRUPO"], title: "Grupos" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruposRoutingModule {}
