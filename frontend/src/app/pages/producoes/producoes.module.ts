import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxMaskModule } from "ngx-mask";

import { NgSelectModule } from "@ng-select/ng-select";

import { ProducoesRoutingModule } from "./producoes-routing.module";
import { VisualizarProducaoComponent } from "./visualizar-producao/visualizar-producao.component";
import { EditarProducaoComponent } from "./editar-producao/editar-producao.component";
import { ResumoProducaoComponent } from "./resumo-producao/resumo-producao.component";
import { OperacaoProducaoComponent } from "./operacao-producao/operacao-producao.component";

@NgModule({
  imports: [
    CommonModule,
    BlockUIModule,
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CurrencyMaskModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ProducoesRoutingModule
  ],
  declarations: [VisualizarProducaoComponent, EditarProducaoComponent, OperacaoProducaoComponent,ResumoProducaoComponent]
})
export class ProducoesModule {}
