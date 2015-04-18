(function() {
  var scene, game, camera;

  function calcAspect() {
    return window.innerWidth/window.innerHeight;
  }

  function updateRendererSize() {
    camera.aspect = calcAspect();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function update() {
    renderer.render(scene, camera);
    window.requestAnimationFrame(update);
  }

  function init() {
    var viewAngle = 75;
    var near = 0.1;
    var far = 10000;

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1);
    camera = new THREE.PerspectiveCamera(viewAngle, calcAspect(), near, far);
    scene = new THREE.Scene();

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

    updateRendererSize();

    window.addEventListener('resize', updateRendererSize);
    update();
  };

  window.initGame = init;
})();
