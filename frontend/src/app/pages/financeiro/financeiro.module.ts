import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { BlockUIModule } from "primeng/blockui";

import { FinanceiroRoutingModule } from "./financeiro-routing.module";
import { FinanceiroLancamentosComponent } from "./financeiro-lancamentos/financeiro-lancamentos.component";
import { FinanceiroPesquisaComponent } from "./financeiro-pesquisa/financeiro-pesquisa.component";
import { SharedModule } from "../../shared/shared.module";

import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
    BlockUIModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    FinanceiroRoutingModule
  ],
  declarations: [FinanceiroLancamentosComponent, FinanceiroPesquisaComponent]
})
export class FinanceiroModule {}
