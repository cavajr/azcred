import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';
import { EmpresaPipe } from './empresa.pipe';

@NgModule({
  imports: [],
  declarations: [ImagenPipe, EmpresaPipe],
  exports: [ImagenPipe, EmpresaPipe]
})
export class PipesModule {}
