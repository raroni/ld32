window.Game = {
  calcAspect: function() {
    return window.innerWidth/window.innerHeight;
  },
  updateRendererSize: function() {
    Game.camera.aspect = Game.calcAspect();
    Game.camera.updateProjectionMatrix();
    Game.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  init: function() {
    var width = 600;
    var height = 450;

    var viewAngle = 75;
    var near = 0.1;
    var far = 10000;

    var renderer = new THREE.WebGLRenderer();
    Game.renderer = renderer;
    renderer.setClearColor(0xffffff, 1);
    var camera = new THREE.PerspectiveCamera(viewAngle, Game.calcAspect(), near, far);
    Game.camera = camera;
    var scene = new THREE.Scene();
    Game.scene = scene;

    scene.add(camera);

    camera.position.set(0, 20, 100);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      shading: THREE.FlatShading
    });

    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xcc0000,
      shading: THREE.FlatShading
    });

    // set up the sphere vars
    var radius = 5, segments = 14, rings = 6;

    // create a new mesh with sphere geometry -
    // we will cover the sphereMaterial next!
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      sphereMaterial
    );
    sphere.position.set(0, 5, -60);
    scene.add(sphere);

    var platformGeometry = new THREE.BoxGeometry(40, 100, 20);
    var platformA = new THREE.Mesh(
      platformGeometry,
      wallMaterial
    );
    platformA.position.set(0, -50, -60)
    scene.add(platformA);

    var platformB = new THREE.Mesh(
      platformGeometry,
      wallMaterial
    );
    platformB.position.set(0, -50, 60);
    scene.add(platformB);

    var pointLight = new THREE.PointLight( 0xFFFFFF );
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    scene.add(pointLight);

    var container = document.body;
    container.appendChild(renderer.domElement);

    Game.updateRendererSize();

    window.addEventListener('resize', Game.updateRendererSize);
    Game.update();
  },
  update: function() {
    Game.renderer.render(Game.scene, Game.camera);
    //window.requestAnimationFrame(Game.update);
  }
};
