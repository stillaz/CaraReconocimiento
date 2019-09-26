import { Component, OnInit, EventEmitter } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  outputs: ['respuesta'],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {

  public respuesta = new EventEmitter<string>();
  public username: string;


  constructor(private alertController: AlertController) { }

  ngOnInit() { }

  async continuar() {
    if (this.username === '778192') {
      this.respuesta.emit(this.username);
      this.username = null;
    } else {
      const alert = await this.alertController.create({
        header: 'Usuario no existe',
        message: 'El usuario no existe en la base de datos',
        buttons: ['Aceptar']
      });

      alert.present();
    }
  }

}
