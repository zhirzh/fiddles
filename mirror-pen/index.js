(function() {
  var NUM_SLICES = 50;
  var OFFSET = 0;
  var LINE_WIDTH = 2;
  var SHOW_BG = true;
  var SIZE = 500;
  var HALF_SIZE = SIZE / 2;

  var LAYERS = document.querySelectorAll('.layer');
  var isPenActive = false;
  var points = [];

  var ctxBG;
  var ctxFG;
  var sliceAngle;

  init();

  document.querySelector('#num-slices').value = NUM_SLICES;
  document.querySelector('#num-slices-value').innerText = NUM_SLICES;
  document.querySelector('#num-slices').oninput = function(e) {
    NUM_SLICES = +e.target.value;
    sliceAngle = 360 / NUM_SLICES;
    document.querySelector('#num-slices-value').innerText = NUM_SLICES;

    resetLayers();
    draw();
  };

  document.querySelector('#offset').value = -OFFSET;
  document.querySelector('#offset-value').innerText = -OFFSET;
  document.querySelector('#offset').oninput = function(e) {
    OFFSET = -e.target.value;
    document.querySelector('#offset-value').innerText = -OFFSET;

    resetLayers();
    draw();
  };

  document.querySelector('#line-width').value = LINE_WIDTH;
  document.querySelector('#line-width-value').innerText = LINE_WIDTH;
  document.querySelector('#line-width').oninput = function(e) {
    LINE_WIDTH = +e.target.value;
    document.querySelector('#line-width-value').innerText = LINE_WIDTH;

    resetLayers();
    draw();
  };

  document.querySelector('#show-bg').checked = SHOW_BG;
  document.querySelector('#show-bg').onchange = function(e) {
    SHOW_BG = e.target.checked;
    console.log(SHOW_BG)

    resetLayers();
    draw();
  };

  window.addEventListener('mousedown', function(e) {
    switch (e.target.id) {
      case 'num-slices':
      case 'offset':
      case 'line-width':
        return;
    }

    isPenActive = true;
    points = [{
      x: e.clientX - ctxFG.rect.left - HALF_SIZE,
      y: e.clientY - ctxFG.rect.top - HALF_SIZE,
      o: OFFSET,
    }];
  });

  window.addEventListener('mousemove', function(e) {
    if (!isPenActive) {
      return;
    }

    points.push({
      x: e.clientX - ctxFG.rect.left - HALF_SIZE,
      y: e.clientY - ctxFG.rect.top - HALF_SIZE,
      o: OFFSET,
    });

    draw();
  });

  window.addEventListener('mouseup', function() {
    isPenActive = false;
  });

  function init() {
    for (var i = 0; i < LAYERS.length; i++) {
      LAYERS[i].width = LAYERS[i].height = SIZE;
      LAYERS[i].ctx = LAYERS[i].getContext('2d');
      LAYERS[i].ctx.translate(HALF_SIZE, HALF_SIZE);
      LAYERS[i].ctx.save(); // save default state
    }

    ctxBG = document.querySelector('#layer-bg').ctx;
    ctxFG = document.querySelector('#layer-fg').ctx;

    setup();
  }

  function resetLayers() {
    for (var i = 0; i < LAYERS.length; i++) {
      LAYERS[i].ctx.restore();
      LAYERS[i].ctx.clearRect(-HALF_SIZE, -HALF_SIZE, SIZE, SIZE);
      LAYERS[i].ctx.save();
    }

    setup();
  }

  function setup() {
    ctxBG.lineWidth = 2;
    ctxBG.strokeStyle = '#555';

    ctxFG.lineWidth = LINE_WIDTH;
    ctxFG.lineJoin = 'round';
    ctxFG.lineCap = 'round';
    ctxFG.strokeStyle = '#345';
    ctxFG.rect = ctxFG.canvas.getBoundingClientRect();

    sliceAngle = 360 / NUM_SLICES;

    clipLayers();
    if (SHOW_BG) {
      drawMirrors();
    }
  }

  function clipLayers() {
    for (var i = 0; i < LAYERS.length; i++) {
      var ctx = LAYERS[i].ctx;

      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ddd';

      ctx.beginPath();
      ctx.moveTo(
        HALF_SIZE * cos(OFFSET),
        HALF_SIZE * sin(OFFSET));

      var n = NUM_SLICES;
      while (n--) {
        var theta = (n * sliceAngle) + OFFSET;
        ctx.lineTo(
          HALF_SIZE * cos(theta),
          HALF_SIZE * sin(theta));
      }

      ctx.stroke();
      ctx.restore();
      ctx.clip();
    }
  }

  function draw() {
    ctxFG.clearRect(-HALF_SIZE, -HALF_SIZE, SIZE, SIZE);
    ctxFG.save();
    var n = NUM_SLICES;
    while (n--) {
      ctxFG.beginPath();
      for (var i = 0; i < points.length - 1; i++) {
        var p1 = points[i];
        var theta1 = OFFSET - p1.o;
        p1.X = p1.x * cos(theta1) - p1.y * sin(theta1);
        p1.Y = p1.x * sin(theta1) + p1.y * cos(theta1);

        var p2 = points[i + 1];
        var theta2 = OFFSET - p2.o;
        p2.X = p2.x * cos(theta2) - p2.y * sin(theta2);
        p2.Y = p2.x * sin(theta2) + p2.y * cos(theta2);

        var mid = {
          x: 0.5 * (p1.X + p2.X),
          y: 0.5 * (p1.Y + p2.Y)
        };

        ctxFG.quadraticCurveTo(p1.X, p1.Y, mid.x, mid.y);
      }

      ctxFG.stroke();
      ctxFG.rotate(rad(sliceAngle));
    }

    ctxFG.restore();
  }

  function drawMirrors() {
    ctxBG.save();
    ctxBG.setLineDash([5]);
    ctxBG.strokeStyle = '#bbb';

    var n = NUM_SLICES;
    while (n--) {
      var theta = (n * sliceAngle) + OFFSET;
      ctxBG.beginPath();
      ctxBG.moveTo(0, 0);
      ctxBG.lineTo(
        HALF_SIZE * cos(theta),
        HALF_SIZE * sin(theta));
      ctxBG.stroke();
    }

    ctxBG.restore();
  }

  function rad(deg) {
    return (deg / 180) * Math.PI;
  }

  function cos(deg) {
    return Math.cos(rad(deg));
  }

  function sin(deg) {
    return Math.sin(rad(deg));
  }
})();
