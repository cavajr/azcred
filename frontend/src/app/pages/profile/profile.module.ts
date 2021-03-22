import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { ProfilesRoutingModule } from "./profiles-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { PipesModule } from "./../../pipes/pipes.module";

@NgModule({
  imports: [CommonModule, ProfilesRoutingModule, SharedModule, FormsModule, PipesModule],
  declarations: [ProfileSettingsComponent]
})
export class ProfileModule {}
