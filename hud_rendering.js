(function() {
  var scene, camera;
  var textures = {};
  var materials = {};
  var sprites = [];

  function init() {
    scene = new THREE.Scene();

    var options = calcCameraOptions();
    var near = 1;
    var far = -1;
    camera = new THREE.OrthographicCamera(
      options.left,
      options.right,
      options.top,
      options.bottom,
      near,
      far
    );
  }

  function calcCameraOptions() {
    var options = {};
    options.top =0.5*16;
    options.bottom = -0.5*16;
    options.left = options.top*Rendering.calcAspect();
    options.right = options.bottom*Rendering.calcAspect();
    return options;
  }

  function handleResize() {
    var options = calcCameraOptions();
    camera.left = options.left;
    camera.right = options.right;
    camera.top = options.top;
    camera.bottom = options.bottom;
    camera.updateProjectionMatrix();
  }

  function render(renderer) {
    renderer.render(scene, camera);
  }

  function createTextureFromCanvas(name, canvas) {
    textures[name] = new THREE.Texture(canvas);
    textures[name].needsUpdate = true;
  }

  function createMaterial(name, textureName) {
    var texture = textures[textureName];
    if(!texture) throw new Error("Texture not found.");

    materials[name] = new THREE.SpriteMaterial({ map: texture });
  }

  function createSprite(materialName) {
    var material = materials[materialName];
    if(!material) throw new Error("Material not found.");

    var sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
    return sprites.length-1;
  }

  window.HUDRendering = {
    init: init,
    render: render,
    createTextureFromCanvas: createTextureFromCanvas,
    createMaterial: createMaterial,
    createSprite: createSprite,
    handleResize: handleResize
  };
})();
