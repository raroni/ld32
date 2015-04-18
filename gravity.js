(function() {
  var newton;
  var gravity = new Vector3(0, -0.01, 0);
  var handles = [];

  function init(aNewton) {
    newton = aNewton;
  }

  function update(timeDelta) {
    var body;
    var force = Vector3.multiply(gravity, timeDelta);
    for(var i=0; i<handles.length; ++i) {
      body = newton.getBody(handles[i]);
      body.force.add(force);
    }
  }

  function create(bodyHandle) {
    handles.push(bodyHandle);
    return handles.length-1;
  }

  window.Gravity = {
    init: init,
    create: create,
    update: update
  };
})();
