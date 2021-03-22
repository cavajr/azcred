import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";

import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgSelectModule } from "@ng-select/ng-select";

import { SharedModule } from "../../shared/shared.module";
import { PerfilsRoutingModule } from "./perfils-routing.module";
import { PerfilsPesquisaComponent } from "./perfils-pesquisa/perfils-pesquisa.component";
import { PerfilsCadastroComponent } from "./perfils-cadastro/perfils-cadastro.component";
import { PerfilsEditarComponent } from "./perfils-editar/perfils-editar.component";

@NgModule({
  imports: [
    CurrencyMaskModule,
    CommonModule,
    FormsModule,
    BlockUIModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    PerfilsRoutingModule
  ],
  declarations: [
    PerfilsPesquisaComponent,
    PerfilsCadastroComponent,
    PerfilsEditarComponent
  ]
})
export class PerfilsModule {}
