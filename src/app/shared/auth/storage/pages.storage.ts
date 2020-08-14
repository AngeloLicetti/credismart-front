import { Router, UrlTree, UrlSegmentGroup, UrlSegment } from '@angular/router';

const PAGES: any[] = [];

export function setPagesList(_pagesList: any[]): void {
    PAGES.length = 0;
    PAGES.push(..._pagesList);
}

function getPages(_pagesList: any[]): any[] {
    return _pagesList.map(
        obj => {
            return {
                nombrePagina: obj['nombrePagina'],
                uri: obj['uri']
            }
        }
    );
}

export function setArrayRoute(_router: Router): any[] {
    let tree: UrlTree = _router.parseUrl(_router.url);
    let group: UrlSegmentGroup = tree.root.children['primary'];
    let segment: UrlSegment[] = group.segments;
    return segment.map(obj => obj['path']);
}

export function getParentsRoutes(): any[] {
    return getPages(PAGES);
}

export function getChildrenRoutes(_router: Router, flgTipo: number): any[] {
    let arrayRoutes = setArrayRoute(_router);// arrayRoutes = ["farmacia","movimiento"]
    let parentModuleURI = arrayRoutes[1];//ruta del padre
    if (!parentModuleURI) {
        return [];
    }
    let parentModule = PAGES.find(obj => obj['uri'] === parentModuleURI);
    if (!parentModule) {
        return [];
    }
    else if (!parentModule['subItem']) {
        return [];
        // return getPages([parentModule]);
    }

    // ---- nivel 2
    let subItem = getPages(parentModule['subItem']);
    if (flgTipo == 2) {
        return subItem;
    }
    // ---- nivel 3
    let subChildren = parentModule['subItem'].find(obj => obj['uri'] === arrayRoutes[2]);
    if (!subChildren) {
        return [];
    }
    else if (!subChildren['subItem']) {
        // return getPages([subChildren]);
        return [];
    }
    let nietos = getPages(subChildren['subItem']);
    if (flgTipo == 3) {
        return nietos;
    }
}

/*
getParentsRoutes()
[admision, farmacia, etc]   
getChildrenRoutes(_router: Router) ---> falta
// JSON
{
                nombrePagina: obj['nombrePagina'],
                uri: obj['uri']
            }
[admision, acredita]
[farmacia, inventario]
[farmacia, reporte]
[farmacia, movimiento]
[[farmacia, movimiento, solicitar]
[farmacia, movimiento, transferir]]
*/
