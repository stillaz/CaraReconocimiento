import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  logueado = new Subject<boolean>();
  usuario: string;

  constructor() {
    setTimeout(() => {
      this.logueado.next(false);
    }, 100)
  }

  loguear(usuario: string) {
    this.logueado.next(true);
    this.logueado.complete();
    this.usuario = usuario;
  }

  desloguear() {
    this.logueado.next(false);
  }
}
