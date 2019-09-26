import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, AlertController } from '@ionic/angular';

declare const loadLabeledImages: any;
declare const labeledFaceDescriptors: any;

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.page.html',
  styleUrls: ['./logueo.page.scss'],
})
export class LogueoPage implements OnInit {

  @ViewChild(IonSlides, { static: false }) slides: IonSlides;

  private alert: HTMLIonAlertElement;
  private loading: HTMLIonLoadingElement;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  time = 0;
  usuario: string;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.loading = await this.loadingController.create({
      message: 'Iniciando reconocimiento facial...',
      showBackdrop: false
    });
  }

  ngAfterViewInit() {
    this.slides.lockSwipeToNext(true);
  }

  async onUsuario(usuario: string) {
    loadLabeledImages(usuario);
    this.loading.onDidDismiss().then(async () => {
      this.alert = await this.alertController.create({
        header: 'Acceso a la plataforma',
        subHeader: 'Permitenos acceder a la cámara para reconocimiento facial en el sistema.',
        message: 'Activa la cámara y acerca tu rostro al frente para verificarte.',
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            this.usuario = usuario;
            setTimeout(() => {
              this.slides.lockSwipeToNext(false);
              this.slides.slideNext();
            }, 500);
          }
        }]
      });

      this.alert.present();
    });
    this.loading.present().then(() => {
      this.espera();
    });
  }

  private espera() {
    setTimeout(async () => {
      if (labeledFaceDescriptors === undefined) {
        this.espera();
      } else {
        this.loading.dismiss();
      }
    }, 500)
  }

}
