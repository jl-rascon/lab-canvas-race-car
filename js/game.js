const Obstacle_Frames = 120

class Game {
    constructor(ctx) {
      this.ctx = ctx
      this.background = new Background(ctx)
  
      this.drawInterval = undefined
      this.fps = 1000/60

      this.car = new Car(ctx)

      this.obstacles = []
      this.drawCount = 0

      this.score = 0

    }
  
    start() {
      if (!this.drawInterval){
        this.drawInterval = setInterval(() => {
          this.clear()
          
          this.move()
          
          this.draw()

          this.checkCrash()
          
          this.drawCount++

          if (this.drawCount % Obstacle_Frames === 0) {
            this.addObstacle()
            this.drawCount = 0
          }

        }, this.fps)
      }
    }

    finish(){
      clearInterval(this.drawInterval)
      this.ctx.save()
      this.ctx.fillStyle = 'rgba(135, 0, 7, 0.4)'
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height-50)
      this.ctx.textAlign = 'center'
      this.ctx.font = '40px Arial'
      this.ctx.fillStyle = 'white'
      this.ctx.fillText('Si bebes no conduzcas!!', this.ctx.canvas.width/2, this.ctx.canvas.height/2)
      this.ctx.restore()
    }
  
    clear() {
      if (typeof this.obstacles[0] !== 'undefined') {
        let height = this.ctx.canvas.height - 50
        if(this.obstacles[0].y >= height) {
        this.score = this.score + this.obstacles[0].score
        } //======== score based on the obstacles width ========
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    
      this.obstacles = this.obstacles.filter(obstacle => obstacle.y <= this.ctx.canvas.height -50)
    }
  
    draw() {
      this.background.draw();
      this.car.draw()
      this.obstacles.forEach(obstacle => obstacle.draw())

      this.ctx.save()
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4'
      this.ctx.fillRect(0, this.ctx.canvas.height-50, this.ctx.canvas.width, 50)
      this.ctx.textAlign = 'center'
      this.ctx.font = '25px Arial'
      this.ctx.fillStyle = 'white'
      this.ctx.fillText(`Score: ${this.score}`, this.ctx.canvas.width/2, this.ctx.canvas.height-20)
      this.ctx.restore()
    }
  
    move() {
      this.car.move()
      this.obstacles.forEach(obstacle => obstacle.move())
      this.background.move()
    }

    onKeyEvent(event){
      this.car.onKeyEvent(event)
    }

    addObstacle(){
      const obstacleMaxWidth = this.ctx.canvas.width - this.car.w * 2

      const randomWidth = Math.floor(Math.random() * obstacleMaxWidth)
      
      const randomX = Math.floor(Math.random() * (this.ctx.canvas.width - randomWidth))

      const score_obstacle = Math.round(randomWidth/10)
      
      this.obstacles.push(
        new Obstacle (this.ctx, randomX, 0, randomWidth, score_obstacle)
      )
      
        //this.score = this.score + Math.round(randomWidth/10)
        //here the score depends on the witdh of the obstacles, but would like to be scored
        //when the obstacle it's passed or eliminated...
    }

    checkCrash(){
      if(this.obstacles.some(obstacle => this.car.crash(obstacle))){
        this.finish()
      }
    }
}