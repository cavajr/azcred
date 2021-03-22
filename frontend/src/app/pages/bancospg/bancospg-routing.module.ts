import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { BancospgPesquisaComponent } from "./bancospg-pesquisa/bancospg-pesquisa.component";
import { AuthGuard } from "../../seguranca/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: BancospgPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_BANCOPG"], title: "Bancos Pagamento" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BancospgRoutingModule {}
