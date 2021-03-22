import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";
import { TabelasPesquisaComponent } from "./tabelas-pesquisa/tabelas-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: TabelasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_TABELA"], title: "Tabela de Comissão" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabelasRoutingModule {}
