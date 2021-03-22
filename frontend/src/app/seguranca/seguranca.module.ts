import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { JwtModule } from "@auth0/angular-jwt";

import { NgxMaskModule } from "ngx-mask";
import { NgSelectModule } from "@ng-select/ng-select";

import { LoginComponent } from "./login/login.component";

import { SegurancaRoutingModule } from "./seguranca-routing.module";
import { AuthGuard } from "./auth.guard";
import { LogoutService } from "./logout.service";

import { environment } from "../../environments/environment";
import { SharedModule } from "../shared/shared.module";

import { PipesModule } from "../pipes/pipes.module";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [
    CommonModule,
    SegurancaRoutingModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    SharedModule,
    PipesModule,
    NgSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes
      }
    })
  ],
  declarations: [LoginComponent],
  providers: [AuthGuard, LogoutService]
})
export class SegurancaModule {}
