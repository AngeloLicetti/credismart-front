import { Component, OnInit, Input } from '@angular/core';

export const VALIDATORS: any = {
    builtInValidators: {
        required: {
            msg: 'Es requerido.'
        },
        pattern: {
            positiveDigits: {
                validatorPattern: '\\d',
                inputPattern: '\\d',
                msg: 'Dígitos Positivos.'
            },
            prices: {
                validatorPattern: '([0-9]+(\\.[0-9]+)?)',
                inputPattern: '[0-9\\.]',
                msg: 'Sólo números.'
            },
            decimalPercentages: {
                validatorPattern: '(([1-9]?[0-9](\\.[0-9]+)?)|(100(\\.0+)?))',
                inputPattern: '[0-9\\.]',
                msg: 'Sólo números con formato %.'
            },
            alfanumerics: {
                validatorPattern: '[a-zA-Z0-9]',
                inputPattern: '[a-zA-Z0-9]',
                msg: 'Caracteres alfanuméricos.'
            },
            letters: {
                validatorPattern: '([a-zA-Zá-úÁ-Ú]+( +[a-zA-Zá-úÁ-Ú]+)*$)',
                inputPattern: '[a-zA-Zá-úÁ-Ú ]',
                msg: 'Sólo letras.'
            },
            digitos: {
                validatorPattern: '([1-9][0-9]?[0-9]?([.][\d]+)?$)',
                inputPattern: '(^[1-9][0-9]?[0-9]?([.][\d]+)?$)',
                msg: 'Solo Números.'
            },
            cellPhone: {
                validatorPattern: '(([9]{1}[0-9]{8})*$)',
                inputPattern: '\\d',
                msg: 'Formato incorrecto'
            },
            cuentaBancaria: {
                validatorPattern: '(([0-9]{16})*$)',
                inputPattern: '\\d',
                msg: 'Formato incorrecto'
            },
            lettersNoSpace: {
                validatorPattern: '[a-zA-Zá-úÁ-Ú]',
                inputPattern: '[a-zA-Zá-úÁ-Ú]',
                msg: 'Sólo letras.'
            },
            alfanumericsSpace: {
                validatorPattern: '([a-zA-Zá-úÁ-Ú0-9]+( +[a-zA-Zá-úÁ-Ú0-9]+)*$)',
                inputPattern: '[a-zA-Zá-úÁ-Ú0-9 ]',
                msg: 'Sólo caracteres Alfanuméricos.'
            },
            simbols: {
                validatorPattern: '^([a-zA-Z0-9_-]+$)',
                inputPattern: '^([a-zA-Z0-9_-]+$)',
                msg: 'Carácteres alfanumericos y simbolo "-".'
            },
            letterswSimbols: {
                validatorPattern: '^([a-zA-Z0-9_-_/_*]+$)',
                inputPattern: '^([a-zA-Z0-9_-_/_*]+$)',
                msg: 'Carácteres alfanumericos y simbolo "-".'
            },
            twoNumber: {
                validatorPattern: '[1-9]\d*',
                inputPattern: '([1-9]+[0-9])',
                msg: 'Solo números mayores de 0'
            },
            realPrices: {
                // validatorPattern: '([0-9]+(\\.[0-9]{1,2})?)',
                validatorPattern: '(([1-9][0-9]{2,8})+(\.[0-9]{1,2})?)',
                inputPattern: '[0-9\\.]',
                msg: 'Monto mayor o igual a 100 con uno o dos decimales'
            },
            
            interes: {
                // validatorPattern: '([0-9]+(\\.[0-9]{1,2})?)',
                validatorPattern: "^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$",
                inputPattern: '[0-9\\.]',
                msg: 'Interés mayor a 0 con uno o dos decimales'
            },
            soloUnEspacioNumeroLetra: {
                validatorPattern: '(([a-zA-Zá-úÁ-Ú0-9]+\\s)*[a-zA-Zá-úÁ-Ú0-9])',
                inputPattern: '[a-zA-Zá-úÁ-Ú0-9\\s]',
                msg: 'solo un espacio'
            },
            soloUnEspacioNumeroLetraPunto: {
                validatorPattern: '(([a-zA-Zá-úÁ-Ú0-9.&\\-]+\\s)*[a-zA-Zá-úÁ-Ú0-9.&\\-])',
                inputPattern: '[a-zA-Zá-úÁ-Ú0-9\\-\\s.]',
                msg: 'solo un espacio'
            },
            soloUnEspacio: {
                validatorPattern: '(([a-zA-Zá-úÁ-Ú0-9.%()\\/-]+\\s)*[a-zA-Zá-úÁ-Ú0-9.%()\\/-])',
                inputPattern: '[a-zA-Zá-úÁ-Ú0-9.%()\\s-]',
                msg: 'solo un espacio y numeros'
            },
            soloUrl:{
                validatorPattern: '\\b((http|https):\\/\\/?)[^\\s()<>]+(?:\\([\\w\\d]+\\)|([^[:punct:]\\s]|\\/?))',
                inputPattern: '[a-zA-Zá-úÁ-Ú0-9._/:]',
                msg: 'Tiene que ser URL'
            },
            soloUnEspacioLetra: {
                validatorPattern: '(([a-zA-Zá-úÁ-Ú]+\\s)*[a-zA-Zá-úÁ-Ú])',
                inputPattern: '[a-zA-Zá-úÁ-Ú\\s]',
                msg: 'Solo  letras'
            },
            nombresFinanciera: {
                validatorPattern: "(([a-zA-Zá-úÁ-Ú\\&\\']+\\s)*[a-zA-Zá-úÁ-Ú\\&\\'])",
                inputPattern: "[a-zA-Zá-úÁ-Ú\\&\\s\\']",
                msg: 'Letras más símbolos'
            },
            preciosMayorCero:{
                validatorPattern:"(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)",
                inputPattern:"[0-9.]",
                msg:'Mayor que Cero(0)'
            }
            // cantidades especificas de numeros con decimales 
            //^([1-9]|[1-8][0-9]|9[0-9]|[12][0-9]{2}|300)(?:\.\d{1,2})?$ 
        },
        minlength: {
            msg: 'Longitud mínima de X.'
        },
        maxlength: {
            msg: 'Longitud máxima de X.'
        }
    },
    customValidators: {
        arrayLength: {
            msg: 'Longitud debe ser de al menos X elementos.'
        },
        base64: {
            msg: 'Formato Base64 requerido.'
        },
        creditCard: {
            msg: 'Formato de tarjeta de crédito/débito necesario.'
        },
        dateISO: {
            msg: 'Fecha con formato de ISO necesaria.'
        },
        date: {
            msg: 'Sólo fechas.'
        },
        digits: {
            msg: 'Sólo dígitos.'
        },
        ngvemail: { // [ngvemail] en template
            msg: 'Formato de correo requerido.'
        },
        equalTo: { // para otros inputs (ngModel)
            msg: 'Debe ser igual al campo de entrada: X.'
        },
        equal: {
            msg: 'Debe ser igual al X.'
        },
        gte: {
            msg: 'Debe ser número mayor o igual a X.'
        },
        gt: {
            msg: 'Debe ser número mayor a X.'
        },
        json: {
            msg: 'Formato JSON requerido.'
        },
        lte: {
            msg: 'Debe ser número menor o igual a X.'
        },
        lt: {
            msg: 'Debe ser número menor a X.'
        },
        maxDate: {
            msg: 'Sólo fechas inferiores o iguales a X.'
        },
        max: {
            msg: 'Sólo números menores a X.'
        },
        minDate: {
            msg: 'Sólo fechas superiores a X.'
        },
        min: {
            msg: 'Sólo números mayores a X.'
        },
        notEqualTo: { // para otros inputs (ngModel)
            msg: 'No debe ser igual a entrada X.'
        },
        notEqual: {
            msg: 'No debe ser igual a X.'
        },
        number: {
            msg: 'Sólo números.'
        },
        property: {
            msg: 'Propiedades X.'
        },
        rangeLength: { // [x, y]
            msg: 'Rango de longitud es X.'
        },
        range: { // [x, y]
            msg: 'Número en rango de X.'
        },
        url: {
            msg: 'Formato de URL necesario.'
        },
        uuid: {
            msg: 'Formato de UUID requerido.'
        }
    }
};

export const QUANTIFIERS: any = {
    '?': {
        pattern: '\\?\+',
        msg: '(Ninguno o uno).'
    },
    '*': {
        pattern: '\\*\+',
        msg: '(Ninguno o más).'
    },
    '+': {
        pattern: '\\+\+',
        msg: '(Uno o más).'
    },
    '{n}': {
        pattern: '\{\\d\+\}',
        msg: '(X exactamente).'
    },
    '{n,}': {
        pattern: '\{\\d\+\,\}',
        msg: '(De X a más).'
    },
    '{,n}': {
        pattern: '\{\,\\d\+\}',
        msg: '(Hasta X).'
    },
    '{n,n}': {
        pattern: '{\d+,\d+}',
        msg: '(De X a Y).'
    },
    
}

/*  RegExp Flags
    "g" for global
    "i" for ignoreCase
    "m" for multiline
    "u" for unicode
    "y" for sticky
*/
export const regexFlagsString: string = 'gimuy';

// trae el pattern de VALIDATORS
function getPatternFromValidators(_pattern: string, _type: string): any {
    const pat = Object.keys(VALIDATORS.builtInValidators.pattern).find(key =>
        key === _pattern);

    return (VALIDATORS.builtInValidators.pattern[pat])[_type];
}

// establece el pattern como regex
function setPattern(_pattern: string, _quantifier: any,
    _exactStart?: boolean, _exactEnd?: boolean, _regexFlags?: string): RegExp {

    const qString = _quantifier['qString'];

    const newPattern = _pattern + (qString ? qString : '');

    return setRegexFlags(setRegexExactString(newPattern, _exactStart, _exactEnd), _regexFlags);
}

// establece los regex flags para el pattern
function setRegexFlags(_pattern: string, _regexFlags?: string): RegExp {
    const flags = (_regexFlags === undefined) ? '' :
        ((regexFlagsString.includes(_regexFlags.split('').sort().join(''))) ?
            _regexFlags : '');

    return new RegExp(_pattern, flags);
}

// establece los caracteres ^..$ para que la cadena sea exacta de comienzo y/o de fin
function setRegexExactString(_pattern: string, _exactStart?: boolean, _exactEnd?: boolean): string {
    // atributo pattern pone ^...$ por defecto si no es regex
    return ((_exactStart !== true) ? '' : '^') + _pattern +
        ((_exactEnd !== true) ? '' : '$');
}

// chequea si es inválido o pendiente el ngControl / controlVar
export function isInvalid(_controlVar: any): boolean {
    return _controlVar['invalid'] || _controlVar['pending'];
}

// establece ingreso de caracteres según el patrón ingresado
export function setInputPattern(_event: any, _pattern: string): void {
    const pat = getPatternFromValidators(_pattern, 'inputPattern');

    if (!pat) {
        return;
    }

    const pattern = setPattern(pat, setQuantifier(''), true, true);

    let inputChar = String.fromCharCode(_event.charCode);

    if (_event.keyCode !== 8 && !pattern.test(inputChar)) {
        _event.preventDefault();
    }
}

// establece el cuantificador para el pattern
export function setQuantifier(_quantifier1?: null | number | string, _quantifier2?: null | number): {} {
    let quantifierObject = {};

    const q1 = typeof _quantifier1;
    const q2 = typeof _quantifier2;

    switch (q1) {
        case 'number':
            if (q2 === 'undefined') {
                quantifierObject['qString'] = '{' + Number.parseInt(_quantifier1 + '') + '}';
                return quantifierObject;
            }
            if (q2 === 'number') {
                quantifierObject['qString'] = '{' + Number.parseInt(_quantifier1 + '') + ',' +
                    Number.parseInt(_quantifier2 + '') + '}';
                return quantifierObject;
            }
            quantifierObject['qString'] = '{' + Number.parseInt(_quantifier1 + '') + ',}';
            return quantifierObject;
        case 'undefined':
            if (q2 === 'number') {
                quantifierObject['qString'] = '{,' + Number.parseInt(_quantifier2 + '') + '}';
                return quantifierObject;
            }
            return setQuantifier(1);
        case 'object':
            if (_quantifier1 === null && q2 === 'number') {
                quantifierObject['qString'] = '{,' + Number.parseInt(_quantifier2 + '') + '}';
                return quantifierObject;
            }
            return setQuantifier(1);
        case 'string':
            if (q2 === 'number' || !Object.keys(QUANTIFIERS)
                .filter(word => word.length === 1)
                .includes(_quantifier1 + '')) {

                if (_quantifier1 === '') {
                    quantifierObject['qString'] = '';
                    return quantifierObject;
                }
                return setQuantifier(1);
            }
            quantifierObject['qString'] = _quantifier1 + '';
            return quantifierObject;
        default:
            return setQuantifier(1);
    }
}

// establece el validator pattern
export function setValidatorPattern(_pattern: string, _quantifier: any,
    _exactStart?: boolean, _exactEnd?: boolean, _regexFlags?: string): RegExp {

    const pat = getPatternFromValidators(_pattern, 'validatorPattern');

    if (!pat) {
        return new RegExp('.', regexFlagsString);
    }

    return setPattern(pat, _quantifier, _exactStart, _exactEnd, _regexFlags);
}

@Component({
    selector: 'app-validators-messages',
    templateUrl: './validators-messages.component.html'
})
export class ValidatorsMessagesComponent implements OnInit {
    @Input() controlVar;
    @Input() dirtyOption;
    @Input() touchedOption;
    @Input() labelName;

    constructor() { }

    //#region getters
    // trae el mensaje de validación
    public getValidationMessage(_controlVar: any): string {

        // leonel
        // puse la condicion de undefined
        const error = _controlVar == undefined ? null : _controlVar['errors'];
        // const error = _controlVar['errors'];

        if (error === null || error === undefined) {
            return 'Error';
        }

        let validator: string;

        let validatorType: any = Object.keys(VALIDATORS).find(
            key => Object.keys(VALIDATORS[key]).some(
                k => Object.keys(error).includes(validator = k))
        );

        if (validatorType === undefined || validatorType === null) {
            return 'Error';
        }

        if (validator === 'pattern') {
            const newRequiredPattern: string =
                this.removeRegexExactString(
                    this.removeEdges(
                        this.removeRegexFlags(
                            (error[validator])['requiredPattern'])));

            let strQuantifier: string;

            return ((VALIDATORS[validatorType])[validator])
            [Object.keys((VALIDATORS[validatorType])[validator])
                .find(key => {
                    strQuantifier =
                        this.getQuantifierString(newRequiredPattern,
                            (((VALIDATORS[validatorType])[validator])[key].validatorPattern));

                    return (newRequiredPattern) ===
                        ((((VALIDATORS[validatorType])[validator])[key].validatorPattern) +
                            strQuantifier);
                })
            ].msg + ' ' + this.getQuantifierMessage(strQuantifier);
        }
        else {
            const errorValue = ((error[validator])
            [Object.keys
                (error[validator]).find
                    (key => key.includes('required'))
            ]); // required, requiredValue, requiredLength

            return this.replaceCharIfIncluded((VALIDATORS[validatorType])[validator].msg,
                errorValue, 'X');// validacion required implicita
        }
    }

    // trae el cuantificador como string
    public getQuantifierString(_newRequiredPattern: string, _patternFromValidator: string): string {
        return _newRequiredPattern.slice(_patternFromValidator.length);
    }

    // trae el mensaje del cuantificador
    public getQuantifierMessage(_strQuantifier: string): string {
        const q = this.getQuantifierPattern(_strQuantifier);

        if (q === '' || q === undefined) {
            return '';
        }

        const message = QUANTIFIERS[q].msg;

        if (q.length === 1) {
            return message;
        }

        const matches = _strQuantifier.match(
            setValidatorPattern('positiveDigits',
                setQuantifier('+'), false, false, 'g'));

        if (q === '{n}' && matches[0] === '1') {
            return '';
        }

        const messageReplacement = this.replaceCharIfIncluded(message, matches[0], 'X');

        return this.replaceCharIfIncluded(messageReplacement, matches[1], 'Y');
    }

    // trae el pattern del cuantificador
    public getQuantifierPattern(_strQuantifier: string): string {
        return Object.keys(QUANTIFIERS).find(
            key => {
                return setPattern(QUANTIFIERS[key].pattern,
                    setQuantifier(''), false, true).test(_strQuantifier);
            }
        );
    }
    //#endregion

    //#region setters
    // establece la condición del mensaje de validación
    public setValidationMessageCondition(_controlVar: any, _ngDirty?: boolean, _ngTouched?: boolean): boolean {
        // leonel
        // puse la condicion de undefined
        return (_controlVar == undefined ? null : _controlVar['invalid']) &&
            // return (_controlVar['invalid']) &&
            (
                (_ngDirty === undefined && _ngTouched === undefined) ? true :
                    (
                        (_ngTouched === undefined) ? _controlVar['dirty'] :
                            (
                                (_ngDirty === undefined) ? _controlVar['touched'] :
                                    (
                                        _controlVar['dirty'] || _controlVar['touched']
                                    )
                            )
                    )
            );

    }
    //#endregion

    //#region removers
    // retira los regex flags del pattern
    public removeRegexFlags(_requiredPattern: string) {
        return _requiredPattern.slice(0, (_requiredPattern.lastIndexOf('/') + 1));
    }

    // retira los caracteres ^..$ que hacen que la cadena sea exacta de comienzo y/o de fin 
    // (establecidos por setRegexExactString())
    public removeRegexExactString(_requiredPattern: string) {
        return (_requiredPattern.startsWith('^') && _requiredPattern.endsWith('$')) ?
            this.removeEdges(_requiredPattern) : _requiredPattern;
    }

    // retira los extremos /../ del regex
    public removeEdges(_str: string) {
        // corta los extremos de _str
        return _str.slice(1, -1);
    }
    //#endregion

    // reemplaza el caracter si está incluido
    public replaceCharIfIncluded(_message: string, _newValue: string, _char: string) {
        return (!_message.includes(_char)) ? _message :
            _message.replace(_char, _newValue);
    }

    ngOnInit() {
    }
}
