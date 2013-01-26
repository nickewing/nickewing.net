$(function() {
  var canvas = $("#canvas"),
      squareSize = 10,
      stepInterval = 100,
      started = false,
      ctx = canvas[0].getContext("2d"),
      documentWidth,
      documentHeight,
      xSquares,
      ySquares,
      xCenter,
      squares;

  function initializeSquares() {
    if (!squares) squares = [];
    for (i = 0; i < xSquares; i++) {
      if (!squares[i]) squares[i] = [];
      for (j = 0; j < ySquares; j++) {
        squares[i][j] = false;
      }
    }
  }

  function addLifeToRegion(probabilityOfLife, x0, x1, y0, y1) {
    for (i = x0; i < x1; i++) {
      for (j = y0; j < y1; j++) {
        if (!squares[i][j]) {
          var alive = Math.random() < probabilityOfLife;
          squares[i][j] = alive ? true : false;
        }
      }
    }
  }

  function addLife(probabilityOfLife, width, height) {
    addLifeToRegion(probabilityOfLife, xCenter - width/2, xCenter + width/2, 0, height);
  }

  function initialize() {
    if (documentWidth < 320) {
      return;
    }

    documentWidth = $(document).width(),
    documentHeight = $(document).height(),

    canvas[0].width = documentWidth;
    canvas[0].height = documentHeight;

    xSquares = Math.ceil(documentWidth / squareSize),
    ySquares = Math.ceil(documentHeight / squareSize),
    xCenter = Math.floor(xSquares / 2),

    initializeSquares();

    addLife(0.5, 40, 60);

    if (!started) {
      step();
      started = true;
    }
  }

  function livingNeighbors(x, y) {
    var total = 0;
    if (squares[x - 1]) {
      if (squares[x - 1][y - 1] == true) total += 1;
      if (squares[x - 1][y] == true) total += 1;
      if (squares[x - 1][y + 1] == true) total += 1;
    }
    if (squares[x]) {
      if (squares[x][y - 1] == true) total += 1;
      if (squares[x][y + 1] == true) total += 1;
    }
    if (squares[x + 1]) {
      if (squares[x + 1][y - 1] == true) total += 1;
      if (squares[x + 1][y] == true) total += 1;
      if (squares[x + 1][y + 1] == true) total += 1;
    }

    return total;
  }

  function step() {
    var successorSquares = [];

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, documentWidth, documentHeight);  

    for (i = 0; i < xSquares; i++) {
      successorSquares[i] = [];
      for (j = 0; j < ySquares; j++) {
        var totalLivingNeighbors = livingNeighbors(i, j);
        var live = squares[i][j];

        if (live) {
          if (totalLivingNeighbors < 2 || totalLivingNeighbors > 3) {
            live = false;
          }
        } else if (totalLivingNeighbors == 3) {
          live = true;
        }

        successorSquares[i][j] = live;

        if (live) {
          ctx.fillStyle = "rgba(150, 150, 160, 1)";
          ctx.fillRect(squareSize * i, squareSize * j, squareSize, squareSize);  
        }
      }
    }

    squares = successorSquares;

    addLife(0.1, 30, 50);

    setTimeout(step, stepInterval);
  }

  $(document).keypress(function(event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
    case 32:
      addLifeToRegion(0.1, 0, xSquares, 0, ySquares);
      break;
    }
  });

  $(window).resize(function(event) {
    initialize();
  });

  initialize();
});

