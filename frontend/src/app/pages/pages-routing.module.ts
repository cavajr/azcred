import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "profile",
    loadChildren: "../pages/profile/profile.module#ProfileModule"
  },
  {
    path: "bancospg",
    loadChildren: "../pages/bancospg/bancospg.module#BancospgModule"
  },
  {
    path: "bancos",
    loadChildren: "../pages/bancos/bancos.module#BancosModule"
  },
  {
    path: "financeiro",
    loadChildren: "../pages/financeiro/financeiro.module#FinanceiroModule"
  },
  {
    path: "corretores",
    loadChildren: "../pages/corretores/corretores.module#CorretoresModule"
  },
  {
    path: "contas",
    loadChildren: "../pages/contas/contas.module#ContasModule"
  },
  {
    path: "sistemas",
    loadChildren: "../pages/sistemas/sistemas.module#SistemasModule"
  },
  {
    path: "tipos",
    loadChildren: "../pages/tipos/tipos.module#TiposModule"
  },
  {
    path: "convenios",
    loadChildren: "../pages/convenios/convenios.module#ConveniosModule"
  },
  {
    path: "perfils",
    loadChildren: "../pages/perfils/perfils.module#PerfilsModule"
  },
  {
    path: "comissoes",
    loadChildren:
      "../pages/importacomissao/importacomissao.module#ImportacomissaoModule"
  },
  {
    path: "producao",
    loadChildren:
      "../pages/importaproducao/importaproducao.module#ImportaproducaoModule"
  },
  {
    path: "producoes",
    loadChildren: "../pages/producoes/producoes.module#ProducoesModule"
  },
  {
    path: "pagamentos",
    loadChildren: "../pages/pagamentos/pagamentos.module#PagamentosModule"
  },
  {
    path: "tabelas",
    loadChildren: "../pages/tabelas/tabelas.module#TabelasModule"
  },
  {
    path: "relatorios",
    loadChildren: "../pages/relatorios/relatorios.module#RelatoriosModule"
  },
  {
    path: "usuarios",
    loadChildren: "../pages/usuarios/usuarios.module#UsuariosModule"
  },
  {
    path: "grupos",
    loadChildren: "../pages/grupos/grupos.module#GruposModule"
  },
  {
    path: "permissoes",
    loadChildren: "../pages/permissoes/permissoes.module#PermissoesModule"
  },
  {
    path: "config",
    loadChildren: "../pages/configuracao/configuracao.module#ConfiguracaoModule"
  },
  {
    path: "acessos",
    loadChildren: "../pages/acessos/acessos.module#AcessosModule"
  },
  {
    path: "remessas",
    loadChildren: "../pages/remessas/remessas.module#RemessasModule"
  },
  {
    path: "dashboard",
    loadChildren: "../pages/dashboard/dashboard.module#DashboardModule"
  },
  { path: "", redirectTo: "dashboard", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
