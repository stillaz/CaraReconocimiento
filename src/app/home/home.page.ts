import { Component } from '@angular/core';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private id: string;
  public usuario: string;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.id = this.usuarioService.usuario;
    if (this.id === '778192') {
      this.usuario = 'Alexander Aguirre';
    }
  }

}
