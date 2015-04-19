(function() {
  var newton;
  var gravity = new Vector3(0, -0.01, 0);
  var components = new ComponentList();
  var handleFreelist = [];

  function init(aNewton) {
    newton = aNewton;
  }

  function update(timeDelta) {
    var force = Vector3.multiply(gravity, timeDelta);
    components.forEach(function(component) {
      var body = newton.getBody(component.bodyHandle);
      body.force.add(force);
    });
  }

  function create(bodyHandle) {
    return components.add({
      bodyHandle: bodyHandle
    });
  }

  function remove(handle) {
    components.remove(handle);
  }

  window.Gravity = {
    init: init,
    create: create,
    update: update,
    remove: remove
  };
})();
