import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";

import { NgSelectModule } from "@ng-select/ng-select";

import { SharedModule } from "./../../shared/shared.module";
import { TiposRoutingModule } from "./tipos-routing.module";
import { TiposPesquisaComponent } from "./tipos-pesquisa/tipos-pesquisa.component";
import { TiposCadastroComponent } from "./tipos-cadastro/tipos-cadastro.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BlockUIModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    TiposRoutingModule
  ],
  declarations: [TiposPesquisaComponent, TiposCadastroComponent]
})
export class TiposModule {}
