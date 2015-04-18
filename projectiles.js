(function() {
  var components = [];
  var newton;

  function init(newNewton) {
    newton = newNewton;
  }

  function create(bodyHandle) {
    components.push({
      bodyHandle: bodyHandle
    });
  }

  function update() {
    var body;
    for(var i=0; i<components.length; ++i) {
      body = newton.getBody(components[i].newtonID);
      /*
      components[i].mesh.position.set(
        body.position.x,
        body.position.y,
        body.position.z
      );
      */
    }
  }

  window.Projectiles = {
    init: init,
    update: update,
    create: create
  }
})();
