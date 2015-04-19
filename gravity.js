(function() {
  var newton;
  var gravity = new Vector3(0, -0.01, 0);
  var components = [];
  var handleFreelist = [];

  function init(aNewton) {
    newton = aNewton;
  }

  function update(timeDelta) {
    var body;
    var force = Vector3.multiply(gravity, timeDelta);
    for(var i=0; i<components.length; ++i) {
      body = newton.getBody(components[i].bodyHandle);
      body.force.add(force);
    }
  }

  function create(bodyHandle) {
    var handle = handleFreelist.pop() || components.length;

    components.push({
      bodyHandle: bodyHandle,
      gravityHandle: handle
    });

    return handle;
  }

  function remove(handle) {
    for(var i=0; i<components.length; ++i) {
      if(components[i].gravityHandle == handle) {
        components.splice(i, 1);
        handleFreelist.push(handle);
        return;
      }
    }
  }

  window.Gravity = {
    init: init,
    create: create,
    update: update,
    remove: remove
  };
})();
