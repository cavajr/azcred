import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConfiguracaoSettingsComponent } from "./configuracao-settings/configuracao-settings.component";
import { AuthGuard } from "../../seguranca/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ConfiguracaoSettingsComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_CONFIG"], title: "Configurações" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoRoutingModule {}
