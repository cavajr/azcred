import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../seguranca/auth.guard";
import { ConveniosPesquisaComponent } from "./convenios-pesquisa/convenios-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: ConveniosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_CONVENIO"], title: "Convênios" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConveniosRoutingModule {}
