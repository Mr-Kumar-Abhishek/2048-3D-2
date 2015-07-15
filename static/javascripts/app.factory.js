'use strict';

APP.prototype.getScene = function () {
    var scene = new THREE.Scene();
    return scene;
};

APP.prototype.getRenderer = function () {
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
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
    var material = new THREE.LineBasicMaterial({color: 0x000000});
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
    // TODO define other colors
    var normalized = 2 * Math.log(value)/(10*Math.log(2));

    var b = Math.max(0, 255 * (1 - normalized))/256;
    var r = Math.max(0, 255 * (normalized - 1))/256;
    var g = (1 - b - r);
    var color = new THREE.Color(r, g, b);

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

    var modifier = new THREE.SubdivisionModifier(3);
    var geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    geometry.mergeVertices();
    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    modifier.modify( geometry );
/*
   geometry.faceVertexUvs[0] = [];
   for (var x=0; x<geometry.vertices.length; ++x) {
       geometry.faceVertexUvs[0][x] = new THREE.Vector2(1./(x+1.));
   }*/

    var material = new THREE.MeshLambertMaterial({map : texture});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(i*1.1, j*1.1, k*1.1);
    mesh.meta = {i:i, j:j, k:k, val:value, nx:i*1.1, ny:j*1.1, nz:k*1.1, fused: false};

    this.scene.add(mesh);
    this.meshes.push(mesh);
};