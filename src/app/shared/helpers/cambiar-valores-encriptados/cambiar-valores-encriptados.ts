import { Injectable } from '@angular/core';

@Injectable()
export class CambiarValoresEncriptados {

/*   public replace(variable) {
    let salidas = "";
    // console.log(variable.length);
    if ((variable != null || variable != undefined) && variable != "") {
      for (let x = 0; x < variable.length; x++) {
        let salida;
        salida = variable.charAt(x);
        salida = salida.replace("+", "%2B");
        salida = salida.replace("@", "%40");
        salida = salida.replace("$", "%24");
        salida = salida.replace(",", "%2C");
        salida = salida.replace(":", "%3A");
        salida = salida.replace(";", "%3B");
        salida = salida.replace("=", "%3D");
        salida = salida.replace("?", "%3F");
        salida = salida.replace("/", "%2F");
        salidas += salida;
      }
    }
    // console.log(salidas);
    return salidas;
  } */

  constructor() { }

  public values: any = {
    "\\+": "%2B",
    "\\@": "%40",
    "\\$": "%24",
    "\\,": "%2C",
    "\\:": "%3A",
    "\\;": "%3B",
    "\\=": "%3D",
    "\\?": "%3F",
    "\\/": "%2F",
  }

  public replace(str: string): string {
    Object.keys(this.values)
      .forEach(char => str = str.replace(new RegExp(char, 'g'), this.values[char]));
    return str;
  }
}
