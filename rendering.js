(function() {
  var materials = {};
  var geometries = {};
  var components = new ComponentList();
  var width, height;

  function createMaterials() {
    materials.bullet = new THREE.MeshLambertMaterial({
      color: 0xcc0000,
      shading: THREE.FlatShading
    });

    createExplosionMaterials();
  }

  function createExplosionMaterials() {
    if(Config.explosionMaterialsCount != 10) {
      throw new Error("Fix this codez.");
    }

    var colors = [
      0xe0c138,
      0xe0c138,
      0xe0c138,
      0xe0c138,
      0xcf8b2c,
      0xcf8b2c,
      0xc14c29,
      0xc14c29,
      0x68230D,
      0x68230D,
      0x41160C
    ];

    for(var i=0; i<colors.length; ++i) {
      materials['explosion'+i] = new THREE.MeshLambertMaterial({
        color: colors[i],
        shading: THREE.FlatShading,
        opacity: 1-i/10,
        transparent: true
      });
    }
  }

  function createGeometries() {
    var segments = 14, rings = 6;
    geometries.bullet = new THREE.SphereGeometry(Config.bulletRadius, segments, rings);

    var segments = 14, rings = 6;
    geometries.explosion = new THREE.SphereGeometry(5, segments, rings);
  }

  function init() {
    createMaterials();
    createGeometries();
  }

  function create(geometryName, materialName, options) {
    options = options || {};
    var geometry = geometries[geometryName];
    if(!geometry) throw new Error("Geometry not found.");

    var material = materials[materialName];
    if(!material) throw new Error("Material not found.");

    var mesh = new THREE.Mesh(geometry, material)
    if(options.castShadow) {
      mesh.castShadow = true;
    }
    //mesh.receiveShadow = false;
    Game.scene.add(mesh);

    return components.add({ mesh: mesh });
  }

  function remove(handle) {
    var component = components.get(handle);
    Game.scene.remove(component.mesh);
    components.remove(handle);
  }

  function resize(newWidth, newHeight) {
    width = newWidth;
    height = newHeight;
    HUDRendering.handleResize();
  }

  function calcAspect() {
    return width/height;
  }

  function updateScale(handle, scale) {
    components.get(handle).mesh.scale.set(scale, scale, scale);
  }

  function updateMaterial(handle, materialName) {
    components.get(handle).mesh.material = materials[materialName];
  }

  function get(handle) {
    return components.get(handle);
  }

  window.Rendering = {
    init: init,
    create: create,
    updateMaterial: updateMaterial,
    get: get,
    remove: remove,
    resize: resize,
    updateScale: updateScale,
    calcAspect: calcAspect
  };
})();
