import { AuthGuard } from "./../../seguranca/auth.guard";
import { AcessosPesquisaComponent } from "./acessos-pesquisa/acessos-pesquisa.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: AcessosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { title: "Senhas Convênios" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcessosRoutingModule {}
