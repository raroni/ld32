(function() {
  function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
  }

  function setup() {
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var context = canvas.getContext('2d');
    var imageData = context.createImageData(canvas.width, canvas.height);

    // draw random dots
    var thickness = 0.05;
    for(var x=0; x<canvas.width; ++x) {
      for(var y=0; y<canvas.height; ++y) {
        if(
          Math.abs(x-canvas.width*0.5) < thickness*canvas.width ||
          Math.abs(y-canvas.height*0.5) < thickness*canvas.height
        ) {
          setPixel(imageData, x, y, 0, 0, 0, 255);
        } else {
          setPixel(imageData, x, y, 0, 0, 0, 0);
        }

      }
    }

    // copy the image data back onto the canvas
    context.putImageData(imageData, 0, 0); // at coords 0,0

    HUDRendering.createTextureFromCanvas('crosshair', canvas);
    HUDRendering.createMaterial('crosshair', 'crosshair');
    HUDRendering.createSprite('crosshair');
  }

  window.Crosshair = {
    setup: setup
  };
})();
