import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./../../seguranca/auth.guard";
import { RemessasPesquisaComponent } from "./remessas-pesquisa/remessas-pesquisa.component";
import { RemessasReceberComponent } from "./remessas-receber/remessas-receber.component";

const routes: Routes = [
  {
    path: "",
    component: RemessasPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_REMESSA"], title: "Listagem de Protocolos" }
  },
  {
    path: ":id",
    component: RemessasReceberComponent,
    canActivate: [AuthGuard],
    data: { roles: ["RECEBER_REMESSA"], title: "Recebimento de Protocolo" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemessasRoutingModule {}
