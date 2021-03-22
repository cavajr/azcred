import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";
import { ContasPesquisaComponent } from "./contas-pesquisa/contas-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: ContasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_CONTA"], title: "Tipos de conta" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContasRoutingModule {}
