import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

import { PagamentosRoutingModule } from './pagamentos-routing.module';
import { PagamentosListaComponent } from './pagamentos-lista/pagamentos-lista.component';
import { PagamentoIndividualComponent } from './pagamento-individual/pagamento-individual.component';

@NgModule({
  imports: [
    CommonModule,
    PagamentosRoutingModule,
    TableModule,
    TooltipModule,
    ButtonModule
  ],
  declarations: [PagamentosListaComponent, PagamentoIndividualComponent]
})
export class PagamentosModule { }
