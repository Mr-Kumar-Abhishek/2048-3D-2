'use strict';

APP.prototype.getScene = function () {
    var scene = new THREE.Scene();
    return scene;
};

APP.prototype.getRenderer = function () {
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0xACA39C);
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
};

APP.prototype.getCamera = function () {
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.set(3.3/2+1, 3.3/2+4, 3.3/2+6);
    return camera;
};

APP.prototype.getControls = function () {
    var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    controls.noKeys = true;
    controls.target = new THREE.Vector3(1.65, 1.65, 1.65);
    return controls;
};

APP.prototype.getBoundingBox = function() {
    var material = new THREE.LineBasicMaterial({color: 0x1d1d25});
    var geometry = new THREE.Geometry();
    var min = -.6;
    var max = 3.9;
    geometry.vertices.push(new THREE.Vector3(min, min, min));
    geometry.vertices.push(new THREE.Vector3(min, min, max));
    geometry.vertices.push(new THREE.Vector3(min, max, max));
    geometry.vertices.push(new THREE.Vector3(min, max, min));
    geometry.vertices.push(new THREE.Vector3(min, min, min));

    geometry.vertices.push(new THREE.Vector3(max, min, min));
    geometry.vertices.push(new THREE.Vector3(max, max, min));
    geometry.vertices.push(new THREE.Vector3(min, max, min));
    geometry.vertices.push(new THREE.Vector3(max, max, min));

    geometry.vertices.push(new THREE.Vector3(max, max, max));
    geometry.vertices.push(new THREE.Vector3(max, min, max));
    geometry.vertices.push(new THREE.Vector3(min, min, max));
    geometry.vertices.push(new THREE.Vector3(min, max, max));

    geometry.vertices.push(new THREE.Vector3(max, max, max));
    geometry.vertices.push(new THREE.Vector3(max, min, max));
    geometry.vertices.push(new THREE.Vector3(max, min, min));

    var line = new THREE.Line(geometry, material);
    this.scene.add(line);
};

APP.prototype.nextId = function () {
    this.currentId += 1;
    return this.currentId;
};

APP.prototype.addCube = function (i, j, k, value) {

    var color;

    switch(value) {
        case 1:
            color = new THREE.Color(0xEDD9D0);
            break;
        case 2:
            color = new THREE.Color(0x7A9CBA);
            break;
        case 4:
            color = new THREE.Color(0x0476BD);
            break;
        case 8:
            color = new THREE.Color(0x56A99D);
            break;
        case 16:
            color = new THREE.Color(0x336B49);
            break;
        case 32:
            color = new THREE.Color(0x5C6441);
            break;
        case 64:
            color = new THREE.Color(0x746933);
            break;
        case 128:
            color = new THREE.Color(0xA9874B);
            break;
        case 256:
            color = new THREE.Color(0xCA5D31);
            break;
        case 512:
            color = new THREE.Color(0x7F280C);
            break;
        case 1024:
            color = new THREE.Color(0x1D1D25);
            break;
        case 2048:
            color = new THREE.Color(0x59394E);
            break;
        case 4096:
            color = new THREE.Color(0x4F4335);
            break;
        case 8192:
            color = new THREE.Color(0xFFD389);
            break;
        case 16384:
            color = new THREE.Color(0xF4F5F7);
            break;
        case 32768:
            color = new THREE.Color(0x35563A);
            break;
        case 65536:
            color = new THREE.Color(0xFF6174);
            break;
        case 131072:
            color = new THREE.Color(0xBDD510);
            break;
        case 262144:
            color = new THREE.Color(0x684922);
            break;
        case 524288:
            color = new THREE.Color(0xFFAC00);
            break;
        case 1048576:
            color = new THREE.Color(0x2C60C9);
            break;
        case 2097152:
            color = new THREE.Color(0xCEAACB);
            break;

        default:
            var normalized = 2 * Math.log(value)/(10*Math.log(2));

            var b = Math.max(0, 255 * (1 - normalized))/256;
            var r = Math.max(0, 255 * (normalized - 1))/256;
            var g = (1 - b - r);
            color = new THREE.Color(r, g, b);
            break;
    }

    // Old Textures
    /*
    var canvas = document.createElement('canvas');
    canvas.id = this.nextId();
    var texture = new THREE.Texture(canvas);
    canvas.height = 256;
    canvas.width = 256;

    var context = canvas.getContext("2d");
    context.fillStyle = '#' + color.getHexString();
    context.fillRect(0, 0, 256, 256);
    context.fillStyle = value == 32 ? '#000000' : '#dddddd';
    context.font = "40pt Verdana bold";
    var textSize = context.measureText("" + value);
    context.fillText(value, (canvas.width-textSize.width)/2, (canvas.height+20)/2);
    texture.needsUpdate = true;

    var material = new THREE.MeshLambertMaterial({map : texture});
    */

    // Smooth cubes
    var modifier = new THREE.SubdivisionModifier(2);
    var geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
    geometry.mergeVertices();
    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    modifier.modify( geometry );

    // Build mesh
    var material = new THREE.MeshLambertMaterial({color : color});
    var mesh = new THREE.Mesh(geometry, material);

    // Init position and meta
    mesh.position.set(i*1.1, j*1.1, k*1.1);
    mesh.meta = {i:i, j:j, k:k, val:value, nx:i*1.1, ny:j*1.1, nz:k*1.1, fused: false};

    this.scene.add(mesh);
    this.meshes.push(mesh);
};