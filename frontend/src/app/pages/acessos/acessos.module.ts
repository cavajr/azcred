import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { AcessosRoutingModule } from "./acessos-routing.module";
import { AcessosPesquisaComponent } from "./acessos-pesquisa/acessos-pesquisa.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    AcessosRoutingModule
  ],
  declarations: [AcessosPesquisaComponent]
})
export class AcessosModule {}
