import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { InputTextModule } from "../../../../node_modules/primeng/inputtext";
import { TableModule } from "../../../../node_modules/primeng/table";
import { ButtonModule } from "../../../../node_modules/primeng/button";
import { TooltipModule } from "../../../../node_modules/primeng/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";

import { ContasRoutingModule } from "./contas-routing.module";
import { ContasPesquisaComponent } from "./contas-pesquisa/contas-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    ContasRoutingModule
  ],
  declarations: [ContasPesquisaComponent]
})
export class ContasModule {}
