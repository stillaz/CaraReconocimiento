import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, AlertController } from '@ionic/angular';
import { FaceDetectService } from '../face-detect.service';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.page.html',
  styleUrls: ['./logueo.page.scss'],
})
export class LogueoPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  time = 0;
  usuario: string;

  constructor(
    private alertController: AlertController,
    private faceDetectService: FaceDetectService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.slides.lockSwipeToNext(true);
  }

  async onUsuario(usuario: string) {
    const loading = await this.loadingController.create({
      message: 'Iniciando reconocimiento facial...',
      duration: 2000,
      showBackdrop: false
    });

    const alert = await this.alertController.create({
      header: 'Acceso a la plataforma',
      subHeader: 'Permitenos acceder a la cámara para reconocimiento facial en el sistema.',
      message: 'Activa la cámara y acerca tu rostro al frente para verificarte.',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          loading.present();
          this.usuario = usuario;
          setTimeout(() => {
            this.slides.lockSwipeToNext(false);
            this.slides.slideNext();
          }, 500);
          this.faceDetectService.loadFaces(usuario);
        }
      }]
    });

    alert.present();
  }

}
