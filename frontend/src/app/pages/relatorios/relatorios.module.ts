import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "../../shared/shared.module";

import { BlockUIModule } from "primeng/blockui";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { RelatoriosRoutingModule } from "./relatorios-routing.module";
import { RecibosComponent } from "./recibos/recibos.component";
import { ControleFinanceiroComponent } from "./controle-financeiro/controle-financeiro.component";
import { FisicoPendenteComponent } from "./fisico-pendente/fisico-pendente.component";
import { RelatoriosPagamentosComponent } from "./pagamentos/pagamentos.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgSelectModule,
    BlockUIModule,
    BsDatepickerModule.forRoot(),
    RelatoriosRoutingModule
  ],
  declarations: [
    RecibosComponent,
    ControleFinanceiroComponent,
    FisicoPendenteComponent,
    RelatoriosPagamentosComponent
  ]
})
export class RelatoriosModule {}
