import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ConfiguracaoSettingsComponent } from "./configuracao-settings/configuracao-settings.component";
import { ConfiguracaoRoutingModule } from "./configuracao-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    ConfiguracaoRoutingModule,
    SharedModule,
    FormsModule,
    PipesModule
  ],
  declarations: [ConfiguracaoSettingsComponent]
})
export class ConfiguracaoModule {}
