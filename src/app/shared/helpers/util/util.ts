import { Injectable } from '@angular/core';

interface OptionFormat {
    year: string,
    month: string,
    day: string
}

interface OptionYears {
    starting: string,
    ending: 10,
}

@Injectable()
export class Util {

    constructor() { }

    public parseFetch(fetch: Date, optionLocales?: string, optionFormat?: OptionFormat): string {
        /**
         * month{
         *  "long":     nombre del mes en caracteres,
         *  "numeric":  # del mes en integer
         *  "narrow":   La primera letra del mes, dependiendo del idioma,
         *  "2-digit":  Mes en 2 dígitos,
         *  "short":    Mes acortado a 3 digitos, depende del idioma
         * }
         * 
         * year{
         *  "numeric": numero completo del año,
         *  "2-digit": 2 ultimos digistos del año
         * }
         * 
         * day{
         *  "numeric": numero del dia,
         *  "2-digit": 2 digistos del dia
         * }
         */
        let options = {
            year: optionFormat != undefined ? optionFormat.year : 'numeric',
            month: optionFormat != undefined ? optionFormat.month : '2-digit',
            day: optionFormat != undefined ? optionFormat.day : '2-digit',
        };
        /**
         * https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
         */

        let _locales = optionLocales ? optionLocales : 'es-PE';
        let fetchparse: string = ((fetch).toLocaleDateString(_locales, options)).split('/').join('-');

        return fetchparse;
    }

    public getYear(optipons?: OptionYears) {
        let _fetch: any = [];
        for (let x = 1; x < optipons.ending; x++) {
            let day = new Date();
            day.setFullYear(day.getFullYear() + x)
            _fetch.push({ id: x, valor: this.parseFetch(day) });
        }
        return _fetch;
    }

    public changeMonthFetch(fetch: Date, monthM: number) {
        fetch.setMonth(fetch.getMonth() + monthM);
        return { fullFetch: fetch, fetch: this.parseFetch(fetch) }
    }

}


