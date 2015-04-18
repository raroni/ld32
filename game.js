(function() {
  var scene, game, camera, width, height, controls;
  var mouseDeltaX = 0, mouseDeltaY = 0;
  var running = false;
  var player;
  var newtonTimeBank = 0;
  var keysPressed = {};
  var newton = new Newton();

  function Player() {
    this.newtonID = newton.create(new Vector3(0, 20, 100), 1);
    this.rotation = new Vector3(0, 0, -1);
  }

  Player.prototype = {
    getForce: function() {
      return newton.getBody(this.newtonID).force;
    },
    getVelocity: function() {
      return newton.getBody(this.newtonID).velocity;
    },
    applyForce: function(v) {
      this.getForce().add(v);
    },
    getPosition: function() {
      return newton.getBody(this.newtonID).position;
    }
  }

  function calcAspect() {
    return width/height;
  }

  function resize(newWidth, newHeight) {
    width = newWidth;
    height = newHeight;
    camera.aspect = calcAspect();
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function updatePlayer(timeDelta) {
    updatePlayerRotation();
    updatePlayerForce(timeDelta);
  }

  function updatePlayerForce(timeDelta) {
    var rotation = player.rotation;
    var direction = new Vector3(
      Math.sin(rotation.y)*Math.cos(rotation.x)*-1,
      Math.sin(rotation.x),
      Math.cos(rotation.y)*Math.cos(rotation.x)*-1
    );
    var right = Vector3.cross(direction, new Vector3(0, 1, 0));

    var force = new Vector3(0, 0, 0);
    if(keysPressed.w) {
      force.add(direction);
    }
    if(keysPressed.s) {
      force.subtract(direction);
    }
    if(keysPressed.d) {
      force.add(right);
    }
    if(keysPressed.a) {
      force.subtract(right);
    }
    force.normalize();
    force.multiply(timeDelta);
    player.applyForce(force);

    var drag = Vector3.multiply(player.getVelocity(), -7);
    player.applyForce(drag);
  }

  function updatePlayerRotation() {
    player.rotation.y -= mouseDeltaX*0.001;
    player.rotation.y = player.rotation.y % (Math.PI*2);
    player.rotation.x -= mouseDeltaY*0.001;
    var limit = Math.PI*0.5*0.9;
    player.rotation.x = Math.max(player.rotation.x, -limit);
    player.rotation.x = Math.min(player.rotation.x, limit);
    mouseDeltaX = 0;
    mouseDeltaY = 0;
  }

  function updateCamera() {
    camera.rotation.x = player.rotation.x;
    camera.rotation.y = player.rotation.y;

    var position = player.getPosition();
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
  }

  function updatePhysics(timeDelta) {
    newtonTimeBank += timeDelta;
    while(Newton.tickDuration < newtonTimeBank) {
      newton.tick();
      newtonTimeBank -= timeDelta;
    }
  }

  function update(timeDelta) {
    if(running) {
      updatePlayer(timeDelta);
      updatePhysics(timeDelta);
    }
    updateCamera();
    renderer.render(scene, camera);
  }

  function init(container, width, height) {
    var viewAngle = 45;
    var near = 0.1;
    var far = 10000;

    player = new Player();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1);
    camera = new THREE.PerspectiveCamera(viewAngle, 1, near, far);
    camera.rotation.order = "YXZ";
    resize(width, height);
    scene = new THREE.Scene();

    scene.add(camera);

    //camera.position.set(0, 20, 100);
    camera.up = new THREE.Vector3(0, 1, 0);
    //camera.lookAt(new THREE.Vector3(0, 0, 0));

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

    container.appendChild(renderer.domElement);
  };

  function pause() {
    running = false;
  }

  function resume() {
    running = true;
  }

  function handleMouseMove(newDeltaX, newDeltaY) {
    if(running) {
      mouseDeltaX += newDeltaX;
      mouseDeltaY += newDeltaY;
    }
  }

  function handleKeyPress(key) {
    keysPressed[key] = true;
  }

  function handleKeyRelease(key) {
    delete keysPressed[key];
  }

  window.Game = {
    init: init,
    update: update,
    resize: resize,
    resume: resume,
    pause: pause,
    handleMouseMove: handleMouseMove,
    handleKeyPress: handleKeyPress,
    handleKeyRelease: handleKeyRelease
  };
})();
