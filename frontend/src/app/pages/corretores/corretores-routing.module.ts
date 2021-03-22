import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../seguranca/auth.guard";
import { CorretoresPesquisaComponent } from "./corretores-pesquisa/corretores-pesquisa.component";
import { CorretoresCadastroComponent } from "./corretores-cadastro/corretores-cadastro.component";
import { CorretoresTabelasComponent } from "./corretores-tabelas/corretores-tabelas.component";
import { CorretoresAcessosComponent } from "./corretores-acessos/corretores-acessos.component";
import { CorretoresProducoesComponent } from "./corretores-producoes/corretores-producoes.component";
import { CorretoresRecibosComponent } from "./corretores-recibos/corretores-recibos.component";
import { CorretoresRemessaComponent } from './corretores-remessa/corretores-remessa.component';

const routes: Routes = [
  {
    path: "",
    component: CorretoresPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["VISUALIZAR_CORRETOR"], title: "Corretores" }
  },
  {
    path: "novo",
    component: CorretoresCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_CORRETOR"], title: "Corretores" }
  },
  {
    path: "acessos",
    component: CorretoresAcessosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ACESSO_CORRETOR"], title: "Corretores Acessos" }
  },
  {
    path: "remessas",
    component: CorretoresRemessaComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ACESSO_CORRETOR"], title: "Protocolo de Físico" }
  },
  {
    path: "tabelas",
    component: CorretoresTabelasComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ACESSO_CORRETOR"], title: "Tabelas de Comissão" }
  },
  {
    path: "producoes",
    component: CorretoresProducoesComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ACESSO_CORRETOR"], title: "Visualizar Produção" }
  },
  {
    path: "relatorios/comissao",
    component: CorretoresRecibosComponent,
    canActivate: [AuthGuard],
    data: { roles: ["ACESSO_CORRETOR"], title: "Relatório de Comissão" }
  },
  {
    path: ":id",
    component: CorretoresCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ["CADASTRAR_CORRETOR"], title: "Corretores" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorretoresRoutingModule {}
