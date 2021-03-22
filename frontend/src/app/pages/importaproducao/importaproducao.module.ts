import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";

import { ImportaproducaoRoutingModule } from "./importaproducao-routing.module";
import { ProducaoImportacaoComponent } from "../importaproducao/producao-importacao/producao-importacao.component";

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    CommonModule,
    ImportaproducaoRoutingModule
  ],
  declarations: [ProducaoImportacaoComponent]
})
export class ImportaproducaoModule {}
