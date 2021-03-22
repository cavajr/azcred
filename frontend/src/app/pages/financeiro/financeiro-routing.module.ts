import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../seguranca/auth.guard";
import { FinanceiroLancamentosComponent } from "./financeiro-lancamentos/financeiro-lancamentos.component";
import { FinanceiroPesquisaComponent } from "./financeiro-pesquisa/financeiro-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: FinanceiroPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_LANCAMENTO"], title: "Financeiro" }
  },
  {
    path: "novo",
    component: FinanceiroLancamentosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_LANCAMENTO"], title: "Financeiro" }
  },
  {
    path: ":id",
    component: FinanceiroLancamentosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_LANCAMENTO"], title: "Financeiro" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceiroRoutingModule {}
