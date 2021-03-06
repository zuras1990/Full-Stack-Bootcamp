var canvas = document.getElementById("canvas");

function Game (){
  this.context = canvas.getContext('2d');
  this.width = this.context.canvas.clientWidth;
  this.height = this.context.canvas.clientHeight;
  this.paddle = new Paddle([this.width, this.height]);
  this.ball = new Ball(5, [this.width/2, this.height/2]);
  this.bricks = new Brick([35, 30], 0);
  this.bricksArray=[];
  this.score = 'You have still ' + this.ball.lifes + 'left!';
}

Game.prototype.createWall = function(){
  for (var raw=1; raw<10; raw++){
    for (var column=0; column<7; column++){
      var position = [35+(this.bricks.size[0]+2)*column, this.bricks.position[1]+(this.bricks.size[1]+2)*raw];
      var color = Math.round(Math.random()*(this.bricks.colorArray.length-1));
      this.bricksArray.push(new Brick(position, color));
    }
  }
}

Game.prototype.renderField = function() {
  if (this.ball.penalty === true) this.context.fillStyle = '#ff0000';
  else this.context.fillStyle = '#000';
  this.context.fillRect(0,0, this.width, this.height);
}

Game.prototype.renderWall = function(){
  var that = this;
  this.bricksArray = this.bricksArray.filter(function(el){
    return el.isHitted === false;
  })
  this.bricksArray.forEach(function(brick){
    brick.renderBrick(that.context);
  });
}

Game.prototype.render = function(){
  this.renderField();
  this.renderWall();
  this.paddle.renderPaddle(this.context);
  this.ball.renderBall(this.context);
}

Game.prototype.collision = function(ball, block){
return ball.position[0]+ball.radious >= block.position[0] 
  && ball.position[0]-ball.radious <= block.position[0] + block.size[0] 
  && ball.position[1]+ball.radious >= block.position[1] 
  && ball.position[1]-ball.radious <= block.position[1] + block.size[1]
}

Game.prototype.isLateralCollision = function(ball, block) {
  return ball.position[1] >= block.position[1]
  && ball.position[1] <= block.position[1] + block.size[1];
}

Game.prototype.checkCollisions = function (){
  var that = this;
  this.bricksArray.forEach(function(brick){
    if (that.collision(that.ball, brick)){
      brick.numOfHits++;
      brick.color = brick.colorArray[brick.numOfHits];
      if (brick.numOfHits>2) brick.isHitted = true; 
      if (that.isLateralCollision(that.ball, brick)) that.ball.bounceLateral();
      else that.ball.bounceVertical();
    }
  });
  if (this.collision(this.ball, this.paddle)) this.ball.bounceVertical();
}

Game.prototype.play = function (){
  this.paddle.movementCheck();
  this.createWall();
  var that = this;
  var interval = setInterval(function(){
    if (that.ball.lifes===0) clearInterval(interval);
    that.render();
    that.paddle.movePaddle(that.width);
    that.ball.moveBall(that.width, that.height, that.paddle, that.bricksArray);
    that.checkCollisions();
    // $("#lifes").append(that.score);
  }, 16.7);
}

var game = new Game ();
game.play();
