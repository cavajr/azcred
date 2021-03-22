import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PagesRoutingModule } from "./pages-routing.module";

import { SharedModule } from "../shared/shared.module";

// Pipe Module
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    PagesRoutingModule
  ]
})
export class PagesModule {}
