import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";

import { BancospgRoutingModule } from "./bancospg-routing.module";
import { BancospgPesquisaComponent } from "./bancospg-pesquisa/bancospg-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    NgSelectModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    BancospgRoutingModule
  ],
  declarations: [BancospgPesquisaComponent]
})
export class BancospgModule {}
