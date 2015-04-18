(function() {
  var gameElm;
  var lockElement;
  var instructionsElm;

  function update() {
    Game.update();
    requestAnimationFrame(update);
  }

  function handlePointerLockChange() {
    if(document.pointerLockElement === lockElement) {
      instructionsElm.style.display = 'none';
      Game.resume();
    } else {
      instructionsElm.style.display = 'block';
      Game.pause();
    }
  }

  function handleResize() {
    Game.resize(window.innerWidth, window.innerHeight);
  }

  function init() {
    gameElm = document.querySelector('div.game');
    initedGame = false;
    lockElement = document.body;

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('resize', handleResize);

    Game.init(gameElm, window.innerWidth, window.innerHeight);

    instructionsElm = document.querySelector('div.lock_instructions');
    instructionsElm.addEventListener('click', function() {
      lockElement.requestPointerLock();
    });

    update();
  }

  window.App = {
    init: init
  };
})();
