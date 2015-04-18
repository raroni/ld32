(function() {
  var materials = {};
  var geometries = {};
  var components = [];
  var width, height;

  function init() {
    materials.projectile = new THREE.MeshLambertMaterial({
      color: 0xcc0000,
      shading: THREE.FlatShading
    });

    var segments = 14, rings = 6;
    geometries.projectile = new THREE.SphereGeometry(Config.projectileRadius, segments, rings);
  }

  function create(geometryName, materialName) {
    var geometry = geometries[geometryName];
    if(!geometry) throw new Error("Geometry not found.");

    var material = materials[materialName];
    if(!material) throw new Error("Material not found.");

    var mesh = new THREE.Mesh(geometry, material)
    Game.scene.add(mesh);

    components.push(mesh);

    return components.length-1;
  }

  function resize(newWidth, newHeight) {
    width = newWidth;
    height = newHeight;
    HUDRendering.handleResize();
  }

  function calcAspect() {
    return width/height;
  }

  function get(handle) {
    return components[handle];
  }

  window.Rendering = {
    init: init,
    create: create,
    get: get,
    resize: resize,
    calcAspect: calcAspect
  };
})();
