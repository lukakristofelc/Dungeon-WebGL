import { Utils } from './Utils.js';

export class Mesh { // TODO Mesh je kakor geometrija za modele

    constructor(options) {
        Utils.init(this, this.constructor.defaults, options);
    }

}

Mesh.defaults = {
    vertices: [],
    texcoords: [],
    normals: [],
    indices: []
};
