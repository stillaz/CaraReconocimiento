import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LogueoPage } from './logueo.page';
import { UsuarioComponent } from './usuario/usuario.component';
import { FaceDetectComponent } from './face-detect/face-detect.component';

const routes: Routes = [
  {
    path: '',
    component: LogueoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LogueoPage, FaceDetectComponent, UsuarioComponent]
})
export class LogueoPageModule { }
