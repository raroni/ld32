(function() {
  var components = [];

  function create(interpolationHandle, meshHandle) {
    components.push({
      interpolationHandle: interpolationHandle,
      meshHandle: meshHandle
    })
  }

  function update() {
    var component, mesh, interpolation;
    for(var i=0; i<components.length; ++i) {
      component = components[i];
      mesh = Rendering.get(component.meshHandle);
      interpolation = Interpolation.get(component.interpolationHandle);
      mesh.position.x = interpolation.currentPosition.x;
      mesh.position.y = interpolation.currentPosition.y;
      mesh.position.z = interpolation.currentPosition.z;
    }
  }

  window.RenderFeed = {
    create: create,
    update: update
  };
})();
