import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./../../seguranca/auth.guard";
import { UsuariosCadastroComponent } from "./usuarios-cadastro/usuarios-cadastro.component";
import { UsuariosPesquisaComponent } from "./usuarios-pesquisa/usuarios-pesquisa.component";

const routes: Routes = [
  {
    path: "",
    component: UsuariosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_USUARIO"], title: "Usuários" }
  },
  {
    path: "novo",
    component: UsuariosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_USUARIO"], title: "Usuários" }
  },
  {
    path: ":id",
    component: UsuariosCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_USUARIO"], title: "Usuários" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
