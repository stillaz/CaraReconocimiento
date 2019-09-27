import { Injectable } from '@angular/core';

declare const loadLabeledImages: any;
declare let labeledFaceDescriptors: any;

@Injectable({
  providedIn: 'root'
})
export class FaceDetectService {

  constructor() { }

  loadFaces(usuario: string) {
    loadLabeledImages(usuario).then((res: any) => {
      labeledFaceDescriptors = res;
    });
  }

  isLoaded() {
    return labeledFaceDescriptors !== undefined;
  }
}
