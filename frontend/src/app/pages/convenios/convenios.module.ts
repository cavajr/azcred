import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { NgSelectModule } from "@ng-select/ng-select";

import { ConveniosRoutingModule } from "./convenios-routing.module";
import { ConveniosPesquisaComponent } from "./convenios-pesquisa/convenios-pesquisa.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    NgSelectModule,
    ConveniosRoutingModule
  ],
  declarations: [ConveniosPesquisaComponent]
})
export class ConveniosModule {}
