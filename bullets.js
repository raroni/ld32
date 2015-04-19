(function() {
  var components = [];
  var cache = {};
  var newton;

  function init(newNewton) {
    newton = newNewton;
  }

  function create(entityHandle, bodyHandle) {
    components.push({
      entityHandle: entityHandle,
      bodyHandle: bodyHandle
    });
    cache[bodyHandle] = components.length-1;
  }

  function update(events) {
    events.forEach(function(event) {
      var value = cache[event[0]];
      if(typeof(value) != "undefined") {
        var component = components[value];
        var body = newton.getBody(component.bodyHandle);
        body.velocity.reset();
        Entities.removeGravity(component.entityHandle);
        Entities.removeSphereCollider(component.entityHandle);
      }
    });
  }

  window.Bullets = {
    init: init,
    update: update,
    create: create
  }
})();
