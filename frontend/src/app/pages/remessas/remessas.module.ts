import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { BlockUIModule } from "primeng/blockui";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { RemessasRoutingModule } from "./remessas-routing.module";
import { RemessasPesquisaComponent } from "./remessas-pesquisa/remessas-pesquisa.component";
import { RemessasReceberComponent } from "./remessas-receber/remessas-receber.component";

@NgModule({
  imports: [
    CommonModule,
    RemessasRoutingModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    BlockUIModule,
    BsDatepickerModule.forRoot(),
    NgSelectModule
  ],
  declarations: [RemessasPesquisaComponent, RemessasReceberComponent]
})
export class RemessasModule {}
