import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";

import { ComissaoImportacaoComponent } from "./comissao-importacao/comissao-importacao.component";

const routes: Routes = [
  {
    path: "",
    component: ComissaoImportacaoComponent,
    canActivate: [AuthGuard],
    data: { roles: ["IMPORTAR_COMISSAO"], title: "Importar Comissão" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportacomissaoRoutingModule {}
