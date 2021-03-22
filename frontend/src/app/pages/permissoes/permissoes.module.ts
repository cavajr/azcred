import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "../../../../node_modules/primeng/table";
import { ButtonModule } from "../../../../node_modules/primeng/button";
import { TooltipModule } from "../../../../node_modules/primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";

import { PermissoesPesquisaComponent } from "./permissoes-pesquisa/permissoes-pesquisa.component";
import { PermissoesCadastroComponent } from "./permissoes-cadastro/permissoes-cadastro.component";
import { PermissoesRoutingModule } from "./permissoes-routing.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    BlockUIModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    PermissoesRoutingModule
  ],
  declarations: [PermissoesCadastroComponent, PermissoesPesquisaComponent]
})
export class PermissoesModule {}
