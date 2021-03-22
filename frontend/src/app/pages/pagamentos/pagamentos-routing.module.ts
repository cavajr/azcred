import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../seguranca/auth.guard";
import { PagamentosListaComponent } from "./pagamentos-lista/pagamentos-lista.component";

const routes: Routes = [
  {
    path: "",
    component: PagamentosListaComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["VISUALIZAR_PAGAMENTO"],
      title: "Pagamento de Contratos"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagamentosRoutingModule {}
