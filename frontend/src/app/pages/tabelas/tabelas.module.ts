import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NgSelectModule } from "@ng-select/ng-select";
import { BlockUIModule } from "primeng/blockui";
import { SharedModule } from "../../shared/shared.module";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { NgxPaginationModule } from "ngx-pagination";

import { TabelasRoutingModule } from "./tabelas-routing.module";
import { TabelasPesquisaComponent } from "./tabelas-pesquisa/tabelas-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ButtonModule,
    TooltipModule,
    TabelasRoutingModule,
    NgSelectModule,
    SharedModule,
    BlockUIModule
  ],
  declarations: [TabelasPesquisaComponent]
})
export class TabelasModule {}
