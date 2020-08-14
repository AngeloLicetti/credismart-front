import { Component, Injectable } from '@angular/core';
import * as download from 'downloadjs';

@Injectable()
export class ReporteService {

  constructor(
  ) { }

  public b64toBlob = function (b64Data, contentType = '', sliceSize = 512) {
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public nativeWindow(): any {
    return window;
  }

  public generar(fileName, fileBase64, typeFile) {
    let rutaDescargaArchivo: any;
    if (typeFile == 1) {
      rutaDescargaArchivo = 'application/vnd.ms-excel';
    } else if (typeFile == 2) {
      rutaDescargaArchivo = 'application/pdf';
    }
    var fileURL = URL.createObjectURL(this.b64toBlob(fileBase64, rutaDescargaArchivo));
    var _window = this.nativeWindow();
    _window.open(fileURL);
  }
}
