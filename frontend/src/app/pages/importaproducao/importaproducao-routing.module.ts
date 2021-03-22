import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../seguranca/auth.guard";

import { ProducaoImportacaoComponent } from "./producao-importacao/producao-importacao.component";

const routes: Routes = [
  {
    path: "",
    component: ProducaoImportacaoComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMPORTAR_PRODUCAO"], title: "Importar Produção" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportaproducaoRoutingModule {}
