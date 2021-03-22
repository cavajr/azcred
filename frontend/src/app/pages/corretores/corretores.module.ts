import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { SelectButtonModule } from "primeng/selectbutton";
import { TabViewModule } from "primeng/tabview";
import { PanelModule } from "primeng/panel";
import { DialogModule } from "primeng/dialog";
import { BlockUIModule } from "primeng/blockui";

import { NgxMaskModule } from "ngx-mask";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgSelectModule } from "@ng-select/ng-select";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxPaginationModule } from "ngx-pagination";

import { CorretoresRoutingModule } from "./corretores-routing.module";
import { SharedModule } from "../../shared/shared.module";

import { CorretoresCadastroComponent } from "./corretores-cadastro/corretores-cadastro.component";
import { CorretoresPesquisaComponent } from "./corretores-pesquisa/corretores-pesquisa.component";
import { CorretoresAcessosComponent } from "./corretores-acessos/corretores-acessos.component";
import { CorretoresTabelasComponent } from "./corretores-tabelas/corretores-tabelas.component";
import { CorretoresProducoesComponent } from "./corretores-producoes/corretores-producoes.component";
import { CorretoresRecibosComponent } from "./corretores-recibos/corretores-recibos.component";
import { CorretoresRemessaComponent } from './corretores-remessa/corretores-remessa.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabViewModule,
    NgxPaginationModule,
    PanelModule,
    BlockUIModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    SelectButtonModule,
    CurrencyMaskModule,
    TableModule,
    NgSelectModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    SharedModule,
    DialogModule,
    CalendarModule,
    CorretoresRoutingModule
  ],
  declarations: [
    CorretoresCadastroComponent,
    CorretoresPesquisaComponent,
    CorretoresAcessosComponent,
    CorretoresTabelasComponent,
    CorretoresProducoesComponent,
    CorretoresRecibosComponent,
    CorretoresRemessaComponent
  ]
})
export class CorretoresModule {}
