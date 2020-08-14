const IPRESS_KEY     = 'financieraId';
const CODUSUARIO_KEY = 'financieraCODUSUARIO';
const IDPERSONAL_KEY = 'financieraIDPERSONAL';
const IDROL_KEY = 'financieraIDROL';
const LOGO_FINANCIERA ='financieraLOGO';
const NOMBRE_FINANCIERA ='financieraNOMBRE';
const DIREC_FINANCIERA ='financieraDIREC';
const TEL_FINANCIERA ='financieraTEL';
const FL_CLIENTE ='financieraFLCLIENTE';
export function removeTelefono() {
    window.localStorage.removeItem(TEL_FINANCIERA);
}
export function saveTelefono(telefono: string) {
    window.localStorage.removeItem(TEL_FINANCIERA);
    window.localStorage.setItem(TEL_FINANCIERA, telefono);
}
export function getTelefono(): string {
    return localStorage.getItem(TEL_FINANCIERA);
}
export function removeFlCliente() {
    window.localStorage.removeItem(FL_CLIENTE);
}
export function saveFlCliente(flCliente: string) {
    window.localStorage.removeItem(FL_CLIENTE);
    window.localStorage.setItem(FL_CLIENTE, flCliente);
}
export function getFlCliente(): string {
    return localStorage.getItem(FL_CLIENTE);
}
export function removeDireccion() {
    window.localStorage.removeItem(DIREC_FINANCIERA);
}

export function saveDireccion(direccion: string) {
    window.localStorage.removeItem(DIREC_FINANCIERA);
    window.localStorage.setItem(DIREC_FINANCIERA, direccion);
}

export function getDireccion(): string {
    return localStorage.getItem(DIREC_FINANCIERA);
}

export function removeLogo() {
    window.localStorage.removeItem(LOGO_FINANCIERA);
}

export function saveLogo(logo: string) {
    window.localStorage.removeItem(LOGO_FINANCIERA);
    window.localStorage.setItem(LOGO_FINANCIERA, logo);
}

export function getLogo(): string {
    return localStorage.getItem(LOGO_FINANCIERA);
}

export function removeNombre() {
    window.localStorage.removeItem(NOMBRE_FINANCIERA);
}

export function saveNombre(nombre: string) {
    window.localStorage.removeItem(NOMBRE_FINANCIERA);
    window.localStorage.setItem(NOMBRE_FINANCIERA, nombre);
}

export function getNombre(): string {
    return localStorage.getItem(NOMBRE_FINANCIERA);
}


export function removeIpress() {
    window.localStorage.removeItem(IPRESS_KEY);
}

export function saveIpress(ipress: string) {
    window.localStorage.removeItem(IPRESS_KEY);
    window.localStorage.setItem(IPRESS_KEY, ipress);
}

export function getIpress(): string {
    return localStorage.getItem(IPRESS_KEY);
}

export function removeCodUsuario() {
    window.localStorage.removeItem(CODUSUARIO_KEY);
}

export function saveCodUsuario(CodUsuario: string) {
    window.localStorage.removeItem(CODUSUARIO_KEY);
    window.localStorage.setItem(CODUSUARIO_KEY, CodUsuario);
}

export function getCodUsuario(): string {
    return localStorage.getItem(CODUSUARIO_KEY);
}

export function removeIdUsuario() {
    window.localStorage.removeItem(IDPERSONAL_KEY);
}

export function saveIdUsuario(IdPersonal: string) {
    window.localStorage.removeItem(IDPERSONAL_KEY);
    window.localStorage.setItem(IDPERSONAL_KEY, IdPersonal);
}

export function getIdUsuario(): string {
    return localStorage.getItem(IDPERSONAL_KEY);
}

export function removeIdRol() {
    window.localStorage.removeItem(IDROL_KEY);
}

export function saveIdRol(IdRol: string) {
    window.localStorage.removeItem(IDROL_KEY);
    window.localStorage.setItem(IDROL_KEY, IdRol);
}

export function getIdRol(): string {
    return localStorage.getItem(IDROL_KEY);
}
