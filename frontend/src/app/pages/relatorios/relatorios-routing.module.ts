import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";

import { RecibosComponent } from "./recibos/recibos.component";
import { ControleFinanceiroComponent } from "./controle-financeiro/controle-financeiro.component";
import { FisicoPendenteComponent } from "./fisico-pendente/fisico-pendente.component";
import { RelatoriosPagamentosComponent } from "./pagamentos/pagamentos.component";

const routes: Routes = [
  {
    path: "comissao",
    component: RecibosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["RELATORIO_COMISSAO"], title: "Relatório de Comissão" }
  },
  {
    path: "pagamentos",
    component: RelatoriosPagamentosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMPRIMIR_PAGAMENTO"], title: "Relatório Sintético de Pagamentos por Corretor" }
  },
  {
    path: "controle-financeiro",
    component: ControleFinanceiroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMPRIMIR_FINANCEIRO"], title: "Relatório Financeiro" }
  },
  {
    path: "fisico-pendente",
    component: FisicoPendenteComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["IMPRIMIR_FISICO_PENDENTE"],
      title: "Relatório de Físico Pendente"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatoriosRoutingModule {}
