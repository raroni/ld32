(function() {
  var components = [];
  var newton;

  function init(aNewton) {
    newton = aNewton;
  }

  function create(bodyHandle) {
    var body = newton.getBody(bodyHandle);
    components.push({
      bodyHandle: bodyHandle,
      oldPosition: body.position.clone(),
      newPosition: body.position.clone(),
      currentPosition: body.position.clone()
    });
    return components.length-1;
  }

  function reload() {
    var component, body;
    for(var i=0; i<components.length; ++i) {
      component = components[i];
      component.oldPosition.set(component.newPosition);
      body = newton.getBody(component.bodyHandle);
      component.newPosition.set(body.position);
    }
  }

  function get(handle) {
    return components[handle];
  }

  function update(progress) {
    var component, difference;
    for(var i=0; i<components.length; ++i) {
      component = components[i];
      difference = Vector3.subtract(component.newPosition, component.oldPosition);
      difference.multiply(progress);
      component.currentPosition = Vector3.add(component.oldPosition, difference);
    }
  }

  window.Interpolation = {
    create: create,
    reload: reload,
    update: update,
    init: init,
    get: get
  }
})();
