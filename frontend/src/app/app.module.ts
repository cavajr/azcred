import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PipesModule } from "./pipes/pipes.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from "./app.component";

// Import containers
// import { DefaultLayoutComponent } from "./containers";

// const APP_CONTAINERS = [DefaultLayoutComponent];

import { PagesComponent } from "./pages/pages.component";

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule
} from "@coreui/angular";

import { CoreModule } from "./core/core.module";
import { SegurancaModule } from "./seguranca/seguranca.module";

import { ToastrModule } from "ngx-toastr";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    PipesModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    SegurancaModule,
    CoreModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent, PagesComponent],
  providers: [PipesModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
