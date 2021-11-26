var pong1, pong2, ball, score1, score2, point1 = 0, point2 = 0;

var twoPlayer = document.getElementById("two-player");
twoPlayer.onclick = function(){
    clearObjects();

    pong1 = new objects(20, 150, 8, 60, "white", false, false);
    pong2 = new objects(670, 150, 8, 60, "white", false, false);
    ball = new objects(350, 190, 7, 0, "white",false, true);
    score1 = new objects(200, 25, "18px", "consolas","white", true, false);
    score2 = new objects(410, 25, "18px", "consolas","white", true, false);

    // PONG_GAME.clear();
    PONG_GAME.start(2);
    PONG_GAME.canvas.setAttribute("style","border-right: none");
}
var onePlayer = document.getElementById("one-player");
onePlayer.onclick = function(){
    clearObjects();

    pong1 = new objects(20, 150, 8, 60, "white", false, false);
    ball = new objects(350, 190, 7, 0, "white",false, true);
    score1 = new objects(300, 25, "18px", "consolas","white", true, false);

    // PONG_GAME.clear();
    PONG_GAME.start(1);
    PONG_GAME.canvas.setAttribute("style","border-right: 7px solid midnightblue");
}
var stopBtn = document.getElementById("stopBtn");
var resumeBtn = document.getElementById("resumeBtn");

stopBtn.onclick = function(){
    PONG_GAME.stop();
    this.setAttribute("disabled","disabled");
    resumeBtn.removeAttribute("disabled");
}
resumeBtn.onclick = function(){
    PONG_GAME.clear();
    PONG_GAME.start();
    this.setAttribute("disabled","disabled");
    stopBtn.removeAttribute("disabled");
}
var resetBtn = document.getElementById("resetBtn");
resetBtn.onclick = function(){
    clearObjects();
    PONG_GAME.clear();
}

var PONG_GAME = {
    canvas : document.getElementById("canvo"),
    start : function(playerCount) {
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval((playerCount == 1)?reloadOnePlayerArea:reloadTwoPlayerArea, 30);    // Change Game State Every 30 miliseconds
        
        window.onkeydown = function (e) {
            PONG_GAME.keys = (PONG_GAME.keys || []);
            PONG_GAME.keys[e.keyCode] = true;
        }
        window.onkeyup = function (e) {
            PONG_GAME.keys = (PONG_GAME.keys || []);
            PONG_GAME.keys[e.keyCode] = false;
        }
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function objects(x, y, width, height, color, isText, isBall){
    this.isBall = isBall;
    this.isText = isText;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedV = 0;
    this.speedH = 0;

    this.drawObj = function() {
        pen = PONG_GAME.context;
        if(isText){
            pen.font = this.width + " " + this.height;
            pen.fillStyle = color;
            pen.fillText(this.text, this.x, this.y);
        } else if(isBall){
            pen.beginPath();
            pen.arc(this.x,this.y,this.width,this.height,2*Math.PI);
            pen.fillStyle = color;
            pen.fill();
        } else {
            pen.fillStyle = color;
            pen.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    this.MoveCP = function() {
        this.x += this.speedH;
        this.y += this.speedV;
   }

   this.isCrash = function( otherobj ){
        
        var myleft = this.x,
            myright = this.x + (this.width),
            mytop = this.y,
            mybottom = this.y + (this.height),
            otherleft = otherobj.x,
            otherright = otherobj.x + (otherobj.width),
            othertop = otherobj.y,
            otherbottom = otherobj.y + (otherobj.height),
            crash = true;

            if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
                crash = false;
            }
            return crash;
    }
}
function clearObjects(){
    pong1 = null;
    pong2 = null;
    ball = null;
    score1 = null;
    score2 = null;
    point1 = 0;
    point2 = 0;
}

function reloadTwoPlayerArea() {
    
    /************* PONG Control *************/

    if(pong1.y <= 0){
        pong1.y = 0;
    }
    if(pong1.y >= 330){
        pong1.y = 330;
    }
    if(pong2.y <= 0){
        pong2.y = 0;
    }
    if(pong2.y >= 330){
        pong2.y = 330;
    }

    /************* Keyboard Control *************/
    if(PONG_GAME.keys && PONG_GAME.keys[87]) {
        console.log("arrow up");
        pong1.y -= 10;
        // if(ball.isCrash(pong1)) {
        //     ball.speedH = 14;
        //     ball.speedV = -4;
        // }
    }
    if(PONG_GAME.keys && PONG_GAME.keys[83]) {
        console.log("arrow down");
        pong1.y += 10;
        // if(ball.isCrash(pong1)) {
        //     ball.speedH = 14;
        //     ball.speedV = 4;
        // }
    }
    if(PONG_GAME.keys && PONG_GAME.keys[38]) {
        pong2.y -= 10;
        // if(ball.isCrash(pong2)) {
        //     ball.speedH = -8;
        //     ball.speedV = -4;
        // }
    }
    if(PONG_GAME.keys && PONG_GAME.keys[40]) {
        pong2.y += 10;
        // if(ball.isCrash(pong2)) {
        //     ball.speedH = -8;
        //     ball.speedV = 4;
        // }
    }
    /*********************** Move The Ball ***********************/

    ball.MoveCP();
    if(ball.isCrash(pong1)){
        ball.speedH = 13;
        ball.speedV = 2;
    }
    else if(ball.isCrash(pong2)){
        ball.speedH = -8;
        ball.speedV = 2;
    }
    else {
        ball.x += -4;
    }

    if(ball.y <= 0){
        ball.speedV = 4;
    }
    if(ball.y >= 390){
        ball.speedV = -4;
    }
    if(ball.x <= 2){
        ball.x = 690;
        point2 += 1;
        if(point2 == 3){
            PONG_GAME.context.fillText("Left Player Won", this.x, this.y);
            PONG_GAME.stop();
        }
    }
    if(ball.x >= 700){
        ball.x = 2;
        point1 += 1;
        if(point1 == 3){
            PONG_GAME.context.fillText("Right Player Won", this.x, this.y);
            PONG_GAME.stop();
        }
    }
    PONG_GAME.clear();
    
    pong1.drawObj();
    pong2.drawObj();
    ball.drawObj();
    score1.text = "Score : " + point1;
    score2.text = "Score : " + point2;
    score1.drawObj();
    score2.drawObj();
}

function reloadOnePlayerArea() {
    
    /************* PONG Control *************/

    if(pong1.y <= 0){
        pong1.y = 0;
    }
    if(pong1.y >= 330){
        pong1.y = 330;
    }

    /************* Keyboard Control *************/
    if(PONG_GAME.keys && PONG_GAME.keys[38]) {
        console.log("arrow up");
        pong1.y -= 10;
        if(ball.isCrash(pong1)) {
            ball.speedH = 14;
            ball.speedV = -4;
        }
    }
    if(PONG_GAME.keys && PONG_GAME.keys[40]) {
        console.log("arrow down");
        pong1.y += 10;
        if(ball.isCrash(pong1)) {
            ball.speedH = 14;
            ball.speedV = 4;
        }
    }
    /*********************** Move The Ball ***********************/

    ball.MoveCP();
    if(ball.isCrash(pong1)){
        ball.speedH = 13;
        ball.speedV = 0;
    }
    else {
        ball.x += -4;
    }

    if(ball.y <= 0){
        ball.speedV = 4;
    }
    if(ball.y >= 390){
        ball.speedV = -4;
    }
    if(ball.x <= 2){
        ball.x = 690;
        point1 += 1;
    }
    if(ball.x >= 700){
        ball.speedH = -4;
    }
    PONG_GAME.clear();
    
    pong1.drawObj();
    ball.drawObj();
    score1.text = "Score : " + point1;
    score1.drawObj();
}