var canvas,ctx;
var left,right;
var player = {x:0,y:0,size:8};
var angle = 0;
var rx = 0,ry = 0;
var trail = [];
var start = true,dead = false,wallCollision = false,lvlCollision = false,greenCollision = false;
var fps = 100,fpsInterval,startTime,now,then,elapsed;
var lvl = 0,lvlCompleted = false,modeCompleted = false;
var maxLvl = localStorage.getItem('maxLvl') != null ? parseInt(localStorage.getItem('maxLvl')) : 1;
var times = JSON.parse(localStorage.getItem("times"))==undefined ? new Array(20) : JSON.parse(localStorage.getItem("times"));
var time,timer,levelTime;
var trails = JSON.parse(localStorage.getItem("trails"))==undefined ? new Array(20) : JSON.parse(localStorage.getItem("trails"));
var spans;
var cookies,cookie,playerCookie,patternsCookie,extrasCookie,colorsCookie,splitNumber;
var colors = ["red","blue","purple","green","cyan","orange","yellow","pink","white"];
var shape = ["square","round"],gap = [14,20,28,36],shadow = [0,10];
var audioGreen = new Audio('sound/green.wav');
var audioHighscore = new Audio('sound/highscore.wav');
var audioCollision = new Audio('sound/collision.wav');

window.onload = function() {
	for(var i=10;i<20;i++) {
		times = null;
		trails = null;
	}
    spans = document.querySelectorAll(".game span");
    for (var i=0;i<maxLvl-1; i++) {
        spans[i].style.backgroundColor = "green";
    }
    for (var i=maxLvl;i<spans.length; i++) {
        spans[i].style.opacity = 0.3;
        spans[i].style.cursor = "context-menu";
        spans[i].style.boxShadow= "0 10px white";
        spans[i].style.transform = "translateY(0)";
    }
}
function startCanvas(num) {
    if(num>maxLvl) return;
    document.getElementById('current-level').style.display = "block";
    document.getElementById('current-time').style.display = "block";
    document.getElementById('best-time').style.display = "block";
    lvl = num;
    for (var i=0;i<4;i++) document.getElementsByClassName('row')[i].style.display = "none";
    cookies();
    canvas = document.getElementById('canvas');
    canvas.style.display = "block";
    ctx = canvas.getContext('2d');
    ctx.width = "900";
    ctx.height = "600";
    ctx.strokeStyle = "white";
    ctx.lineJoin='round'; 
    ctx.lineWidth = 4;
    ctx.fillStyle = "black";
    startDrawing(fps);
}
function cookies() {
    cookies = document.cookie.replace(/\s+/g, '');
    cookie = cookies.split(/[=;]/);
    playerCookie = cookie[cookie.indexOf("player")+1];
    patternsCookie = cookie[cookie.indexOf("patterns")+1];
    extrasCookie = cookie[cookie.indexOf("extras")+1];
    colorsCookie = cookie[cookie.indexOf("colors")+1];
    splitNumber = parseInt(playerCookie[0]);
}
function startDrawing(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    draw();
}
function draw(newtime) {
    if(checkConditions()) {
        now = newtime;
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            ctx.clearRect(0,0,ctx.width,ctx.height);
            startPosition();
            newPosition();
            drawPbTrail();
            drawTrail();
            drawRectangle();
            drawLevel(lvl);
            message();
            checkCollision();
        }
    }
    requestAnimationFrame(draw);
}
function startPosition() {
    if(start) {
    	time = window.performance.now();
        player.x = 12;
        player.y = 300;
        start = false;
    }
} 
function newPosition() {
    if(left) angle -= 0.05;
    if(right) angle += 0.05;
    rx = 2*Math.cos(angle);
    ry = 2*Math.sin(angle);
    player.x += rx;
    player.y += ry;
}
function drawTrail() {
    trail.unshift(player.y);
    trail.unshift(player.x);
    ctx.save();
    ctx.lineWidth = player.size;
    ctx.lineCap = shape[playerCookie[2]];
    ctx.shadowBlur = shadow[playerCookie[3]];
    ctx.shadowColor = colors[playerCookie[4]];
    ctx.strokeStyle = colors[playerCookie[4]];
    ctx.setLineDash([(120/(splitNumber+1))-gap[playerCookie[1]]*((splitNumber)/(splitNumber+1)),gap[playerCookie[1]]]);
    ctx.beginPath();
    ctx.moveTo(trail[0],trail[1]);
    for (var i=2;i<122;i+=2) {
        ctx.lineTo(trail[i],trail[i+1]);
    }
    ctx.stroke();
    ctx.restore();
}
function drawPbTrail() {
	if(trails[lvl-1] == undefined || !pbTrail) return;
	var iStart = trails[lvl-1].length - trail.length;
    ctx.save();
    ctx.lineWidth = player.size;
    ctx.lineCap = "square";
    ctx.strokeStyle = "rgba(250,0,0,0.5)";
    ctx.beginPath();
    ctx.moveTo(trails[lvl-1][iStart],trails[lvl-1][iStart+1]);
    for (var i=iStart+2;i<iStart+124;i+=2) {
        ctx.lineTo(trails[lvl-1][i],trails[lvl-1][i+1]);
    }
    ctx.stroke();
    ctx.restore();
}
function drawLevel(lvl) {
    if(lvl == 1) {
        ctx.beginPath();ctx.moveTo(0,400);ctx.lineTo(900,400);ctx.moveTo(0,200);ctx.lineTo(900,200);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 2) {
        ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(900,200);ctx.moveTo(0,400);ctx.lineTo(900,400);
        ctx.moveTo(150,200);ctx.lineTo(150,325);ctx.moveTo(300,400);ctx.lineTo(300,275);
        ctx.moveTo(450,200);ctx.lineTo(450,325);ctx.moveTo(600,400);ctx.lineTo(600,275);
        ctx.moveTo(750,200);ctx.lineTo(750,325);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 3) {
        ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(900,265);ctx.moveTo(0,400);ctx.lineTo(900,335);ctx.rect(425,275,50,50);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 4) {
        ctx.beginPath();ctx.moveTo(0,265);ctx.lineTo(30,265);ctx.lineTo(170,150);
        ctx.lineTo(450,380);ctx.lineTo(730,150);ctx.lineTo(870,265);ctx.lineTo(900,265);
        ctx.moveTo(0,335);ctx.lineTo(30,335);ctx.lineTo(170,220);ctx.lineTo(450,450);
        ctx.lineTo(730,220);ctx.lineTo(870,335);ctx.lineTo(900,335);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 5) {
        ctx.beginPath();ctx.moveTo(0,265);ctx.lineTo(50,265);ctx.lineTo(205,0);ctx.lineTo(245,0);ctx.lineTo(400,265);
        ctx.lineTo(500,265);ctx.lineTo(655,0);ctx.lineTo(695,0);ctx.lineTo(850,265);ctx.lineTo(900,265);
        ctx.moveTo(0,335);ctx.lineTo(50,335);ctx.lineTo(205,598);ctx.lineTo(245,598);ctx.lineTo(400,335);
        ctx.lineTo(500,335);ctx.lineTo(655,598);ctx.lineTo(695,598);ctx.lineTo(850,335);ctx.lineTo(900,335);
        ctx.moveTo(100,300);ctx.lineTo(225,80);ctx.lineTo(350,300);ctx.lineTo(225,520);ctx.closePath();
        ctx.moveTo(550,300);ctx.lineTo(675,80);ctx.lineTo(800,300);ctx.lineTo(675,520);ctx.closePath();ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 6) {
        ctx.beginPath();ctx.moveTo(0,200);ctx.lineTo(40,240);ctx.lineTo(120,160);ctx.lineTo(200,160);ctx.lineTo(300,260);
        ctx.lineTo(510,260);ctx.moveTo(0,400);ctx.lineTo(40,360);ctx.lineTo(120,440);ctx.lineTo(200,440);ctx.lineTo(300,340);
        ctx.lineTo(510,340);ctx.moveTo(75,275);ctx.lineTo(100,300);ctx.lineTo(75,325);ctx.lineTo(120,370);ctx.lineTo(270,300);
        ctx.lineTo(120,230);ctx.closePath();ctx.moveTo(450,260);ctx.lineTo(450,100);ctx.lineTo(740,100);ctx.lineTo(740,180);
        ctx.lineTo(820,180);ctx.lineTo(820,260);ctx.lineTo(900,260);ctx.moveTo(450,340);ctx.lineTo(450,500);ctx.lineTo(740,500);
        ctx.lineTo(740,420);ctx.lineTo(820,420);ctx.lineTo(820,340);ctx.lineTo(900,340);ctx.moveTo(660,180);ctx.lineTo(520,180);
        ctx.lineTo(580,180);ctx.lineTo(580,420);ctx.lineTo(520,420);ctx.lineTo(660,420);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,264);ctx.lineTo(898,336);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 7) {
        ctx.beginPath();ctx.moveTo(0,270);ctx.lineTo(65,270);ctx.lineTo(135,200);ctx.arcTo(170,165,205,200,50);ctx.lineTo(275,270);
        ctx.arcTo(310,305,345,270,50);ctx.lineTo(415,200);ctx.arcTo(450,165,485,200,50);ctx.lineTo(555,270);ctx.arcTo(590,305,625,270,50);
        ctx.lineTo(695,200);ctx.arcTo(730,165,765,200,50);ctx.lineTo(835,270);ctx.lineTo(900,270);ctx.moveTo(0,330);ctx.lineTo(65,330);
        ctx.lineTo(135,260);ctx.arcTo(170,225,205,260,50);ctx.lineTo(275,330);ctx.arcTo(310,365,345,330,50);ctx.lineTo(415,260);
        ctx.arcTo(450,225,485,260,50);ctx.lineTo(555,330);ctx.arcTo(590,365,625,330,50);ctx.lineTo(695,260);ctx.arcTo(730,225,765,260,50);
        ctx.lineTo(835,330);ctx.lineTo(900,330);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,274);ctx.lineTo(898,326);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 8) {
        ctx.beginPath();ctx.moveTo(167,233);ctx.lineTo(200,200);ctx.moveTo(167,366);ctx.lineTo(200,400);ctx.moveTo(133,267);
        ctx.lineTo(100,300);ctx.moveTo(133,333);ctx.lineTo(100,300);ctx.moveTo(33,233);ctx.lineTo(0,200);ctx.lineTo(200,200);
        ctx.lineTo(200,400);ctx.lineTo(125,400);ctx.moveTo(67,267);ctx.lineTo(100,300);ctx.lineTo(0,400);ctx.lineTo(75,400);
        ctx.lineTo(75,460);ctx.lineTo(260,460);ctx.lineTo(260,140);ctx.lineTo(520,400);ctx.lineTo(640,280);ctx.lineTo(560,200);
        ctx.arcTo(560,130,620,140,50);ctx.lineTo(700,220);ctx.lineTo(800,220);ctx.lineTo(800,340);ctx.lineTo(900,340);
        ctx.moveTo(200,200);ctx.lineTo(200,80);ctx.lineTo(300,80);ctx.lineTo(520,300);ctx.lineTo(555,265);ctx.moveTo(440,220);
        ctx.lineTo(440,80);ctx.lineTo(700,80);ctx.lineTo(700,150);ctx.lineTo(860,150);ctx.lineTo(860,270);ctx.lineTo(900,270);
        ctx.moveTo(280,160);ctx.lineTo(300,140);ctx.moveTo(400,180);ctx.lineTo(380,200);ctx.moveTo(420,300);ctx.lineTo(440,280);
        ctx.moveTo(800,220);ctx.lineTo(800,200);ctx.moveTo(860,270);ctx.lineTo(860,290);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 9) {
        ctx.beginPath();ctx.moveTo(150,430);ctx.lineTo(150,540);ctx.moveTo(250,490);ctx.lineTo(250,600);ctx.rect(55,500,40,40);
        ctx.moveTo(255,230);ctx.lineTo(150,300);ctx.lineTo(255,370);ctx.closePath();ctx.moveTo(0,270);
        ctx.lineTo(100,270);ctx.lineTo(250,170);ctx.lineTo(340,170);ctx.lineTo(340,250);ctx.lineTo(310,250);ctx.lineTo(310,350);
        ctx.lineTo(340,350);ctx.lineTo(340,430);ctx.lineTo(50,430);ctx.lineTo(50,330);ctx.lineTo(100,330);ctx.lineTo(340,490);
        ctx.lineTo(340,540);ctx.lineTo(510,370);ctx.lineTo(510,240);ctx.lineTo(620,130);ctx.lineTo(755,265);ctx.lineTo(900,120);
        ctx.moveTo(380,600);ctx.lineTo(580,400);ctx.lineTo(580,240);ctx.lineTo(620,200);ctx.lineTo(900,480);
        ctx.rect(539,300,12,12);ctx.moveTo(510,370);ctx.lineTo(510,420);ctx.moveTo(440,540);ctx.lineTo(440,490);
        ctx.rect(780,285,30,30);ctx.rect(840,230,30,30);ctx.rect(840,340,30,30);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,130);ctx.lineTo(898,470);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 10) {
        ctx.beginPath();
        ctx.moveTo(0,270);ctx.lineTo(60,270);ctx.lineTo(120,330);ctx.lineTo(160,330);ctx.lineTo(220,270);ctx.lineTo(280,270);
        ctx.lineTo(280,200);ctx.lineTo(350,200);ctx.moveTo(0,330);ctx.lineTo(40,330);ctx.lineTo(100,390);ctx.lineTo(180,390);
        ctx.lineTo(240,330);ctx.lineTo(280,330);ctx.lineTo(280,400);ctx.lineTo(480,400);ctx.lineTo(480,200);ctx.lineTo(410,200);
        ctx.moveTo(430,325);ctx.lineTo(430,350);ctx.lineTo(330,350);ctx.lineTo(330,250);ctx.lineTo(350,200);ctx.lineTo(350,150);
        ctx.lineTo(410,90);ctx.lineTo(500,90);ctx.lineTo(560,150);ctx.lineTo(560,250);ctx.lineTo(580,270);ctx.lineTo(600,270);
        ctx.lineTo(700,195);ctx.lineTo(800,270);ctx.lineTo(900,280);
        ctx.moveTo(390,275);ctx.lineTo(430,275);ctx.lineTo(430,250);ctx.lineTo(390,250);ctx.lineTo(410,200);ctx.lineTo(410,170);
        ctx.lineTo(430,150);ctx.lineTo(480,150);ctx.lineTo(500,170);ctx.lineTo(500,270);ctx.lineTo(560,330);ctx.lineTo(600,330);
        ctx.lineTo(700,405);ctx.lineTo(800,330);ctx.lineTo(900,320);
        ctx.moveTo(650,300);ctx.bezierCurveTo(650,240,750,240,750,300);ctx.bezierCurveTo(750,360,650,360,650,300);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,284);ctx.lineTo(898,316);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 11) {
        ctx.beginPath();ctx.rect(120,270,120,60);ctx.rect(300,270,120,60);
        ctx.moveTo(480,330);ctx.lineTo(560,280);ctx.lineTo(640,330);ctx.lineTo(640,270);ctx.lineTo(560,220);ctx.lineTo(480,270);
        ctx.moveTo(680,330);ctx.lineTo(760,380);ctx.lineTo(840,330);ctx.lineTo(840,270);ctx.lineTo(760,320);ctx.lineTo(680,270);
        ctx.fill();
        ctx.beginPath();ctx.moveTo(2,330);ctx.lineTo(480,330);ctx.lineTo(560,280);ctx.lineTo(640,330);ctx.lineTo(680,330);
		ctx.lineTo(760,380);ctx.lineTo(840,330);ctx.lineTo(900,330);
		ctx.moveTo(2,270);ctx.lineTo(480,270);ctx.lineTo(560,220);ctx.lineTo(640,270);ctx.lineTo(680,270);
        ctx.lineTo(760,320);ctx.lineTo(840,270);ctx.lineTo(900,270);
        ctx.moveTo(335,270);ctx.lineTo(335,295);ctx.moveTo(385,330);ctx.lineTo(385,305);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(120,272);ctx.lineTo(120,328);ctx.moveTo(240,272);ctx.lineTo(240,328);
        ctx.moveTo(300,272);ctx.lineTo(300,328);ctx.moveTo(420,272);ctx.lineTo(420,328);ctx.moveTo(480,272);ctx.lineTo(480,328);
        ctx.moveTo(640,272);ctx.lineTo(640,328);ctx.moveTo(680,272);ctx.lineTo(680,328);ctx.moveTo(840,272);ctx.lineTo(840,328);stroke("red");
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 12) {
        ctx.beginPath();ctx.moveTo(  0,200);ctx.lineTo(900,200);ctx.moveTo(  0,400);ctx.lineTo(900,400);
        ctx.moveTo(150,200);ctx.lineTo(150,325);ctx.moveTo(300,400);ctx.lineTo(300,275);
        ctx.moveTo(450,200);ctx.lineTo(450,325);ctx.moveTo(600,400);ctx.lineTo(600,275);
        ctx.moveTo(750,200);ctx.lineTo(750,325);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 13) {
        ctx.beginPath();ctx.moveTo(  0,200);ctx.lineTo(900,265);ctx.moveTo(  0,400);ctx.lineTo(900,335);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 14) {
        ctx.beginPath();ctx.moveTo(  0,265);ctx.lineTo( 30,265);ctx.lineTo(170,150);
        ctx.lineTo(450,380);ctx.lineTo(730,150);ctx.lineTo(870,265);ctx.lineTo(900,265);
        ctx.moveTo(  0,335);ctx.lineTo( 30,335);ctx.lineTo(170,220);ctx.lineTo(450,450);
        ctx.lineTo(730,220);ctx.lineTo(870,335);ctx.lineTo(900,335);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 15) {
        ctx.beginPath();ctx.moveTo(  0,265);ctx.lineTo(50,265);ctx.lineTo(205,0);ctx.lineTo(245,0);ctx.lineTo(400,265);
        ctx.lineTo(500,265);ctx.lineTo(655,0);ctx.lineTo(695,0);ctx.lineTo(850,265);ctx.lineTo(900,265);
        ctx.moveTo(  0,335);ctx.lineTo(50,335);ctx.lineTo(205,596);ctx.lineTo(245,596);ctx.lineTo(400,335);
        ctx.lineTo(500,335);ctx.lineTo(655,596);ctx.lineTo(695,596);ctx.lineTo(850,335);ctx.lineTo(900,335);
        ctx.moveTo(100,300);ctx.lineTo(225,80);ctx.lineTo(350,300);ctx.lineTo(225,520);ctx.closePath();
        ctx.moveTo(550,300);ctx.lineTo(675,80);ctx.lineTo(800,300);ctx.lineTo(675,520);ctx.closePath();ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 16) {
        ctx.beginPath();ctx.moveTo(2,400);ctx.lineTo(900,400);ctx.moveTo(2,200);ctx.lineTo(900,200);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 17) {
        ctx.beginPath();ctx.moveTo(  0,200);ctx.lineTo(900,200);ctx.moveTo(  0,400);ctx.lineTo(900,400);
        ctx.moveTo(150,200);ctx.lineTo(150,325);ctx.moveTo(300,400);ctx.lineTo(300,275);
        ctx.moveTo(450,200);ctx.lineTo(450,325);ctx.moveTo(600,400);ctx.lineTo(600,275);
        ctx.moveTo(750,200);ctx.lineTo(750,325);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 18) {
        ctx.beginPath();ctx.moveTo(  0,200);ctx.lineTo(900,265);ctx.moveTo(  0,400);ctx.lineTo(900,335);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 19) {
        ctx.beginPath();ctx.moveTo(  0,265);ctx.lineTo( 30,265);ctx.lineTo(170,150);
        ctx.lineTo(450,380);ctx.lineTo(730,150);ctx.lineTo(870,265);ctx.lineTo(900,265);
        ctx.moveTo(  0,335);ctx.lineTo( 30,335);ctx.lineTo(170,220);ctx.lineTo(450,450);
        ctx.lineTo(730,220);ctx.lineTo(870,335);ctx.lineTo(900,335);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 20) {
        ctx.beginPath();ctx.moveTo(  0,265);ctx.lineTo(50,265);ctx.lineTo(205,0);ctx.lineTo(245,0);ctx.lineTo(400,265);
        ctx.lineTo(500,265);ctx.lineTo(655,0);ctx.lineTo(695,0);ctx.lineTo(850,265);ctx.lineTo(900,265);
        ctx.moveTo(  0,335);ctx.lineTo(50,335);ctx.lineTo(205,596);ctx.lineTo(245,596);ctx.lineTo(400,335);
        ctx.lineTo(500,335);ctx.lineTo(655,596);ctx.lineTo(695,596);ctx.lineTo(850,335);ctx.lineTo(900,335);
        ctx.moveTo(100,300);ctx.lineTo(225,80);ctx.lineTo(350,300);ctx.lineTo(225,520);ctx.closePath();
        ctx.moveTo(550,300);ctx.lineTo(675,80);ctx.lineTo(800,300);ctx.lineTo(675,520);ctx.closePath();ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
}
function checkCollision() {
    if((wallCollision || lvlCollision) && !greenCollision) {
        if(audio) {
			audioCollision.currentTime = 0;
			audioCollision.play();
    	}
        deadMessage();
        wallCollision = lvlCollision = left = right = false;
        start = dead = true;
        trail = [];
        angle = 0;
    }
    if(greenCollision) {
    	time = window.performance.now() - time;
    	if(audio && (time >= times[lvl-1] || times[lvl-1] == undefined)) {
    		audioGreen.currentTime = 0;
    		audioGreen.play();
    	}
    	if(times[lvl-1] != undefined) {
			document.getElementById('time-message').style.display = "block";
			if(time < times[lvl-1]) {
				document.getElementById('time-message').style.color = "lime";
				document.getElementById('time-message').innerHTML = ((time-times[lvl-1])/1000).toFixed(3);
			}
			else {
				document.getElementById('time-message').style.color = "red";
				document.getElementById('time-message').innerHTML = "+" + ((time-times[lvl-1])/1000).toFixed(3);
			}
		}
    	if(time < times[lvl-1] || times[lvl-1] == undefined) {
    		if(audio && times[lvl-1] != undefined) {
    			audioHighscore.currentTime = 0;
    			audioHighscore.play();
    		}
    		if(trails[lvl-1] != null) console.log(trail.length + " | " + trails[lvl-1].length);
    		times[lvl-1] = time;
    		localStorage.setItem("times", JSON.stringify(times));
    		trails[lvl-1] = trail;
    		localStorage.setItem("trails", JSON.stringify(trails));
    	}
    	if(speedrun) {
    		if(lvl == 20) modeCompletedMessage();
    		else lvlCompletedMessage();
    		if((lvl+1) > maxLvl) localStorage.setItem('maxLvl',lvl+1);
            greenCollision = left = right = false;
            lvlCompleted = start = true;
            trail = [];
            angle = 0;
            return;
    	}
        if(lvl == 20) {
            modeCompletedMessage();
            modeCompleted = true;
            localStorage.setItem('maxLvl',++lvl);
        }
        else {
            if(++lvl > maxLvl) localStorage.setItem('maxLvl',lvl);
            lvlCompletedMessage();
            greenCollision = left = right = false;
            lvlCompleted = start = true;
            trail = [];
            angle = 0;
        }
    }
}
function checkConditions() {
    if(start && (!dead && !lvlCompleted) && (!left && !right)) {
        ctx.clearRect(0,0,ctx.width,ctx.height);
        drawSquare();
        drawRectangle();
        drawLevel(lvl);
        message();
        document.getElementById('canvas-message').style.display = "none";
		document.getElementById('time-message').style.display = "none";
        document.getElementById('current-time').style.color = "initial";
        return false;
    }
    if(start && (dead || lvlCompleted)) {
        return false;
    }
    if(modeCompleted) {
        return false;
    }
    return true;
}
function deadMessage() {
    document.getElementById('canvas-message').style.display = "block";
	document.getElementById('canvas-message').innerHTML = "Spacebar to restart level";
}
function lvlCompletedMessage() {
	document.getElementById('canvas-message').style.display = "block";
	if(!speedrun) document.getElementById('canvas-message').innerHTML = "Level completed!<br>Spacebar for next level";
	else document.getElementById('canvas-message').innerHTML = "Level completed!<br>Spacebar to restart level";
}
function modeCompletedMessage() {
	document.getElementById('canvas-message').style.display = "block";
	if(!speedrun) document.getElementById('canvas-message').innerHTML = "Easy Mode completed!";
	else document.getElementById('canvas-message').innerHTML = "Easy Mode completed!<br>Spacebar to restart level";
}
function message() {
	timer = !dead && !start ? (window.performance.now()-time)/1000 : 0;
	levelTime = times[lvl-1] == null ? "---" : (times[lvl-1]/1000).toFixed(3);
    document.getElementById('current-level').innerHTML = "Lvl " + lvl;
	document.getElementById('current-time').innerHTML = timer.toFixed(3);
	document.getElementById('best-time').innerHTML = levelTime;
}
function drawSquare() {
    trail[0] = 8;trail[1] = 300;trail[2] = 4;trail[3] = 300;
    ctx.beginPath();
    ctx.moveTo(trail[0],trail[1]);ctx.lineTo(trail[2],trail[3]);
    ctx.save();
    ctx.lineCap = shape[playerCookie[2]];
    ctx.shadowBlur = shadow[playerCookie[3]];
    ctx.shadowColor = colors[playerCookie[4]];
    ctx.strokeStyle = colors[playerCookie[4]];
    ctx.lineWidth = player.size;
    ctx.stroke();
    ctx.restore();
}
function drawRectangle() {
    ctx.beginPath();
    ctx.rect(2,2,896,596);
    ctx.stroke();
    wallCollision = isPointInStroke();
}
function isPointInStroke() {
    return ctx.isPointInStroke(player.x,player.y) || ctx.isPointInStroke(player.x-ry*2,player.y+rx*2) || 
    ctx.isPointInStroke(player.x+ry*2,player.y-rx*2);
}
function stroke(color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}
document.onmousemove = function(e) {
	var x = e.clientX;
	var y = e.clientY - 80;

	document.getElementById('level-time').style.left = x + "px";
	document.getElementById('level-time').style.top = y + "px";
}
function box(string,number) {
	if(times[number] != undefined) {
		document.getElementById('level-time').style.display = string;
		document.getElementById('level-time').innerHTML = (times[number]/1000).toFixed(3) + "s";
	}
}
document.onkeydown = function(e) {
    if(e.keyCode == 37) left = true,right = false;
    if(e.keyCode == 39) right = true,left = false;
    if(e.keyCode == 32 && lvlCompleted) lvlCompleted = false;
    if(e.keyCode == 32 && dead) dead = false;
    if(e.keyCode == 32 && !dead && !start && speedrun) {
    	dead = left = right = false;
    	start = true;
    	trail = [];
    	angle = 0;
    }
    if(dead || lvlCompleted) left = false,right = false;
    if(e.keyCode == 38 && !lvlCompleted && times[lvl-1] != undefined && lvl < 20) {
    	dead = left = right = false;
    	start = true;
    	trail = [];
    	angle = 0;
    	lvl++;
    }
    if(e.keyCode == 40 && !lvlCompleted && lvl > 1) {
    	dead = left = right = false;
    	start = true;
    	trail = [];
    	angle = 0;
    	lvl--;
    }
}
document.onkeyup = function(e) {
    if(e.keyCode == 37) left = false;
    if(e.keyCode == 39) right = false;
}