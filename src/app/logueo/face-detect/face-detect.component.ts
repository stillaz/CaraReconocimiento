import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/usuario.service';

declare const runFaceRecognition: any;
declare const stopVideo: any;

@Component({
  inputs: ['usuario'],
  selector: 'app-face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.scss'],
})
export class FaceDetectComponent implements OnInit {

  private estado: number;
  private noReconocido = false;
  usuario: string;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private usuarioService: UsuarioService) { }

  ngOnInit() { }

  cancelar() {
    location.reload();
  }

  async ngAfterViewInit() {
    if (this.usuario) {
      const subject = new Subject();
      runFaceRecognition(subject, this.usuario).subscribe(async (res: number) => {
        this.estado = res;
        const loading = await this.loadingController.create({});
        this.procesarReconocimiento(subject, loading);
      });
    }
  }

  private async procesarReconocimiento(subject: Subject<any>, loading: HTMLIonLoadingElement) {
    if (this.estado === -1) {
      this.presentNoCara();
    } else if (this.estado === 1 && !this.noReconocido) {
      loading.message = 'Verificando rostro';
      loading.duration = 5000;
      loading.onDidDismiss().then(async res => {
        if (!res.data) {
          const alert = await this.alertController.create({
            header: 'Rostro no identificado',
            message: 'Intenta nuevamente, procura estar desde un lugar con poca luminicidad.',
            buttons: [{
              text: 'Aceptar',
              handler: () => {
                this.noReconocido = false;
              }
            }]
          });

          alert.present();
        }
      });
      loading.present();
      this.noReconocido = true;
    } else if (this.estado === 2) {
      subject.complete();
      loading.dismiss({ data: 'ok' }).then(() => {
        loading.message = 'Reconocimiento facial completo, ingresando a la plataforma...';
        loading.duration = 2000;
        loading.present();
        loading.onDidDismiss().then(async () => {
          this.usuarioService.loguear(this.usuario);
          stopVideo();
        });
      });
    } else {
      loading.dismiss();
    }
  }

  private presentNoCara() {
    setTimeout(async () => {
      if (this.estado === -1) {
        const toast = await this.toastController.create({
          message: 'No se detecta algún rostro',
          duration: 2000
        });

        toast.present();

        this.presentNoCara();
      }
    }, 5000);
  }

}
