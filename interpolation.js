(function() {
  var components = new ComponentList();
  var newton;

  function init(aNewton) {
    newton = aNewton;
  }

  function create(bodyHandle) {
    var body = newton.getBody(bodyHandle);
    return components.add({
      bodyHandle: bodyHandle,
      oldPosition: body.position.clone(),
      newPosition: body.position.clone(),
      currentPosition: body.position.clone()
    });
  }

  function reload() {
    components.forEach(function(component) {
      component.oldPosition.set(component.newPosition);
      var body = newton.getBody(component.bodyHandle);
      component.newPosition.set(body.position);
    });
  }

  function remove(handle) {
    components.remove(handle);
  }

  function get(handle) {
    return components.get(handle);
  }

  function update(progress) {
    components.forEach(function(component) {
      var difference = Vector3.subtract(component.newPosition, component.oldPosition);
      difference.multiply(progress);
      component.currentPosition = Vector3.add(component.oldPosition, difference);
    });
  }

  window.Interpolation = {
    create: create,
    reload: reload,
    update: update,
    init: init,
    get: get,
    remove: remove
  }
})();
