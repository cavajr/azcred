import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { NgSelectModule } from "@ng-select/ng-select";
import { SharedModule } from "../../shared/shared.module";

import { ImportacomissaoRoutingModule } from "./importacomissao-routing.module";
import { ComissaoImportacaoComponent } from "./comissao-importacao/comissao-importacao.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    ImportacomissaoRoutingModule,
    SharedModule
  ],
  declarations: [ComissaoImportacaoComponent]
})
export class ImportacomissaoModule {}
