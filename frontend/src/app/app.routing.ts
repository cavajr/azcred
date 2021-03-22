import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages/pages.component";
import { LoginComponent } from "./seguranca/login/login.component";

import { AuthGuard } from "./seguranca/auth.guard";

import { PaginaNaoEncontradaComponent } from "./core/pagina-nao-encontrada/pagina-nao-encontrada.component";
import { NaoAutorizadoComponent } from "./core/nao-autorizado/nao-autorizado.component";

export const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: PagesComponent,
    loadChildren: "../app/pages/pages.module#PagesModule",
    data: {
      title: "Início"
    }
  },
  { path: "login", component: LoginComponent },
  { path: "nao-autorizado", component: NaoAutorizadoComponent },
  { path: "pagina-nao-encontrada", component: PaginaNaoEncontradaComponent },
  { path: "**", redirectTo: "pagina-nao-encontrada" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, enableTracing: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
