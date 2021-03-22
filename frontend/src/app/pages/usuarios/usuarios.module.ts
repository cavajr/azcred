import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { CheckboxModule } from "primeng/checkbox";
import { BlockUIModule } from "primeng/blockui";

import { NgSelectModule } from "@ng-select/ng-select";

import { PipesModule } from "./../../pipes/pipes.module";

import { UsuariosRoutingModule } from "./usuarios-routing.module";
import { UsuariosPesquisaComponent } from "./usuarios-pesquisa/usuarios-pesquisa.component";
import { UsuariosCadastroComponent } from "./usuarios-cadastro/usuarios-cadastro.component";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    BlockUIModule,
    FormsModule,
    InputTextModule,
    NgSelectModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
    SharedModule,
    PipesModule
  ],
  declarations: [UsuariosPesquisaComponent, UsuariosCadastroComponent]
})
export class UsuariosModule {}
