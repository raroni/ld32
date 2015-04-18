(function() {
  var components = [];
  var geometry, material;
  var newton;
  var radius = 1;

  function init(newNewton) {
    newton = newNewton;

    material = new THREE.MeshLambertMaterial({
      color: 0xcc0000,
      shading: THREE.FlatShading
    });

    // set up the sphere vars
    var segments = 14, rings = 6;
    geometry = new THREE.SphereGeometry(radius, segments, rings);
  }

  function create(position, force) {
    var mesh = new THREE.Mesh(
      geometry,
      material
    );
    Rendering.add(mesh);
    var newtonID = newton.create(position, radius);
    var body = newton.getBody(newtonID);
    body.force.add(force);

    components.push({
      mesh: mesh,
      newtonID: newtonID
    });
  }

  function update() {
    var body;
    for(var i=0; i<components.length; ++i) {
      body = newton.getBody(components[i].newtonID);
      components[i].mesh.position.set(
        body.position.x,
        body.position.y,
        body.position.z
      );
    }
  }

  window.Projectiles = {
    init: init,
    update: update,
    create: create
  }
})();
