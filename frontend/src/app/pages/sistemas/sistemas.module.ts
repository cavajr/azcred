import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { NgSelectModule } from "@ng-select/ng-select";

import { SistemasRoutingModule } from "./sistemas-routing.module";
import { SistemasPesquisaComponent } from "./sistemas-pesquisa/sistemas-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    NgSelectModule,
    SistemasRoutingModule
  ],
  declarations: [SistemasPesquisaComponent]
})
export class SistemasModule {}
