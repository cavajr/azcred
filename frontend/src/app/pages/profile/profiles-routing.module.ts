import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./../../seguranca/auth.guard";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileSettingsComponent,
    canActivate: [AuthGuard],
    data: { title: "Perfil do Usuário" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesRoutingModule {}
