import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";

import { BancosRoutingModule } from "./bancos-routing.module";
import { BancosPesquisaComponent } from "./bancos-pesquisa/bancos-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    BancosRoutingModule,
    FormsModule,
    SharedModule,
    TableModule,
    ButtonModule,
    NgSelectModule,
    TooltipModule
  ],
  declarations: [BancosPesquisaComponent]
})
export class BancosModule {}
