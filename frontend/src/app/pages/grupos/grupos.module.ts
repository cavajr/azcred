import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { TableModule } from "../../../../node_modules/primeng/table";
import { ButtonModule } from "../../../../node_modules/primeng/button";
import { TooltipModule } from "../../../../node_modules/primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";

import { GruposRoutingModule } from "./grupos-routing.module";
import { GruposPesquisaComponent } from "./grupos-pesquisa/grupos-pesquisa.component";
import { GruposCadastroComponent } from "./grupos-cadastro/grupos-cadastro.component";
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
    GruposRoutingModule
  ],
  declarations: [GruposPesquisaComponent, GruposCadastroComponent]
})
export class GruposModule {}
