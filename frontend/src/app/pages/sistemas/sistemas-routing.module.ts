import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../seguranca/auth.guard";

import { SistemasPesquisaComponent } from "./sistemas-pesquisa/sistemas-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: SistemasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_SISTEMA"], title: "Sistemas" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemasRoutingModule {}
