import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";
import { BancosPesquisaComponent } from "./bancos-pesquisa/bancos-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: BancosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_BANCO"], title: "Bancos Contrato" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancosRoutingModule {}
