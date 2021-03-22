import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PermissoesCadastroComponent } from "./permissoes-cadastro/permissoes-cadastro.component";
import { PermissoesPesquisaComponent } from "./permissoes-pesquisa/permissoes-pesquisa.component";
import { AuthGuard } from "../../seguranca/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: PermissoesPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_PERMISSAO"], title: "Permissões" }
  },
  {
    path: "novo",
    component: PermissoesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_PERMISSAO"], title: "Permissões" }
  },
  {
    path: ":id",
    component: PermissoesCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_PERMISSAO"], title: "Permissões" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissoesRoutingModule {}
