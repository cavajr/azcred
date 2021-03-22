import { EditarProducaoComponent } from "./editar-producao/editar-producao.component";
import { VisualizarProducaoComponent } from "./visualizar-producao/visualizar-producao.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./../../seguranca/auth.guard";
import { ResumoProducaoComponent } from "./resumo-producao/resumo-producao.component";
import { OperacaoProducaoComponent } from "./operacao-producao/operacao-producao.component";

const routes: Routes = [
  {
    path: "",
    component: VisualizarProducaoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["VISUALIZAR_PRODUCAO"],
      title: "Visualizar Importação de Produção"
    }
  },
  {
    path: 'operacoes',
    component: OperacaoProducaoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['VISUALIZAR_PRODUCAO'],
      title: 'Créditos / Débitos Manuais'
    }
  },
  {
    path: "resumo",
    component: ResumoProducaoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["VISUALIZAR_PRODUCAO"],
      title: "Resumo de Pagamentos"
    }
  },
  {
    path: ":id",
    component: EditarProducaoComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["VISUALIZAR_PRODUCAO"],
      title: "Editar Importação de Produção"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProducoesRoutingModule {}
