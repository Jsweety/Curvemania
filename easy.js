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
        ctx.beginPath();
        ctx.moveTo(0,400);ctx.lineTo(900,400);ctx.moveTo(0,200);ctx.lineTo(900,200);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 2) {
        ctx.beginPath();
        ctx.moveTo(0,200);ctx.lineTo(900,200);ctx.moveTo(0,400);ctx.lineTo(900,400);
        ctx.moveTo(150,200);ctx.lineTo(150,325);ctx.moveTo(300,400);ctx.lineTo(300,275);
        ctx.moveTo(450,200);ctx.lineTo(450,325);ctx.moveTo(600,400);ctx.lineTo(600,275);
        ctx.moveTo(750,200);ctx.lineTo(750,325);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,203);ctx.lineTo(898,397);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 3) {
        ctx.beginPath();
        ctx.moveTo(0,200);ctx.lineTo(900,265);ctx.moveTo(0,400);ctx.lineTo(900,335);ctx.rect(425,275,50,50);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 4) {
        ctx.beginPath();
        ctx.moveTo(0,265);ctx.lineTo(30,265);ctx.lineTo(170,150);
        ctx.lineTo(450,380);ctx.lineTo(730,150);ctx.lineTo(870,265);ctx.lineTo(900,265);
        ctx.moveTo(0,335);ctx.lineTo(30,335);ctx.lineTo(170,220);ctx.lineTo(450,450);
        ctx.lineTo(730,220);ctx.lineTo(870,335);ctx.lineTo(900,335);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 5) {
        ctx.beginPath();
        ctx.moveTo(0,265);ctx.lineTo(50,265);ctx.lineTo(205,0);ctx.lineTo(245,0);ctx.lineTo(400,265);
        ctx.lineTo(500,265);ctx.lineTo(655,0);ctx.lineTo(695,0);ctx.lineTo(850,265);ctx.lineTo(900,265);
        ctx.moveTo(0,335);ctx.lineTo(50,335);ctx.lineTo(205,598);ctx.lineTo(245,598);ctx.lineTo(400,335);
        ctx.lineTo(500,335);ctx.lineTo(655,598);ctx.lineTo(695,598);ctx.lineTo(850,335);ctx.lineTo(900,335);
        ctx.moveTo(100,300);ctx.lineTo(225,80);ctx.lineTo(350,300);ctx.lineTo(225,520);ctx.closePath();
        ctx.moveTo(550,300);ctx.lineTo(675,80);ctx.lineTo(800,300);ctx.lineTo(675,520);ctx.closePath();
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,268);ctx.lineTo(898,332);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 6) {
        ctx.beginPath();
        ctx.moveTo(0,200);ctx.lineTo(40,240);ctx.lineTo(120,160);ctx.lineTo(200,160);ctx.lineTo(300,260);
        ctx.lineTo(510,260);ctx.moveTo(0,400);ctx.lineTo(40,360);ctx.lineTo(120,440);ctx.lineTo(200,440);ctx.lineTo(300,340);
        ctx.lineTo(510,340);ctx.moveTo(75,275);ctx.lineTo(100,300);ctx.lineTo(75,325);ctx.lineTo(120,370);ctx.lineTo(270,300);
        ctx.lineTo(120,230);ctx.closePath();ctx.moveTo(450,260);ctx.lineTo(450,100);ctx.lineTo(740,100);ctx.lineTo(740,180);
        ctx.lineTo(820,180);ctx.lineTo(820,260);ctx.lineTo(900,260);ctx.moveTo(450,340);ctx.lineTo(450,500);ctx.lineTo(740,500);
        ctx.lineTo(740,420);ctx.lineTo(820,420);ctx.lineTo(820,340);ctx.lineTo(900,340);ctx.moveTo(660,180);ctx.lineTo(520,180);
        ctx.lineTo(580,180);ctx.lineTo(580,420);ctx.lineTo(520,420);ctx.lineTo(660,420);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(898,264);ctx.lineTo(898,336);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 7) {
        ctx.beginPath();
        ctx.moveTo(0,270);ctx.lineTo(65,270);ctx.lineTo(135,200);ctx.arcTo(170,165,205,200,50);ctx.lineTo(275,270);
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
        ctx.beginPath();
        ctx.moveTo(167,233);ctx.lineTo(200,200);ctx.moveTo(167,366);ctx.lineTo(200,400);ctx.moveTo(133,267);
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
        ctx.beginPath();
        ctx.moveTo(150,430);ctx.lineTo(150,540);ctx.moveTo(250,490);ctx.lineTo(250,600);ctx.rect(55,500,40,40);
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
    	ctx.beginPath();ctx.moveTo(809,366);ctx.lineTo(771,404);ctx.lineTo(821,454);ctx.lineTo(859,416);ctx.closePath();ctx.fill();
        ctx.beginPath();
        ctx.moveTo(2,325);ctx.lineTo(60,325);ctx.lineTo(60,275);ctx.lineTo(325,275);ctx.lineTo(425,175);ctx.lineTo(425,70);
        ctx.lineTo(170,70);ctx.lineTo(170,185);ctx.lineTo(240,185);ctx.lineTo(290,135);ctx.lineTo(290,185);ctx.lineTo(140,185);
        ctx.lineTo(100,145);ctx.lineTo(70,145);ctx.lineTo(40,115);ctx.bezierCurveTo(40,80,60,70,85,70);ctx.lineTo(170,70);
        ctx.moveTo(2,225);ctx.lineTo(295,225);ctx.lineTo(375,145);ctx.lineTo(375,100);ctx.lineTo(220,100);ctx.lineTo(220,150);
        ctx.lineTo(270,100);ctx.moveTo(40,185);ctx.lineTo(100,185);ctx.lineTo(80,165);ctx.lineTo(40,165);ctx.lineTo(40,185);
        ctx.moveTo(100,35);ctx.lineTo(375,35);ctx.moveTo(187,52);ctx.lineTo(287,52);
        ctx.moveTo(475,2);ctx.lineTo(475,175);ctx.lineTo(575,275);ctx.lineTo(900,275);
        ctx.moveTo(325,325);ctx.lineTo(425,425);ctx.bezierCurveTo(325,425,325,425,325,325);
        ctx.moveTo(295,275);ctx.lineTo(295,455);ctx.lineTo(475,455);ctx.lineTo(475,375);ctx.lineTo(525,375);ctx.lineTo(525,325);
        ctx.lineTo(800,600);ctx.moveTo(375,275);ctx.lineTo(375,225);ctx.lineTo(425,225);ctx.moveTo(375,325);ctx.lineTo(375,375);
        ctx.lineTo(425,375);ctx.lineTo(525,275);ctx.lineTo(525,225);ctx.lineTo(475,225);ctx.lineTo(375,325);
        ctx.moveTo(650,275);ctx.lineTo(620,305);ctx.moveTo(595,330);ctx.lineTo(563,362);
        ctx.moveTo(700,275);ctx.lineTo(630,345);ctx.moveTo(605,370);ctx.lineTo(590,385);ctx.moveTo(750,275);ctx.lineTo(640,385);
        ctx.moveTo(800,275);ctx.lineTo(675,400);ctx.moveTo(650,425);ctx.lineTo(637,438);
        ctx.moveTo(850,275);ctx.lineTo(740,385);ctx.moveTo(715,410);ctx.lineTo(662,463);
        ctx.moveTo(900,275);ctx.lineTo(810,365);ctx.lineTo(900,455);ctx.moveTo(688,487);ctx.lineTo(770,405);ctx.lineTo(900,535);
        ctx.rect(80,255,20,20);ctx.rect(150,225,20,20);ctx.rect(220,255,20,20);
        ctx.moveTo(295,225);ctx.lineTo(305,235);ctx.moveTo(325,255);ctx.lineTo(335,265);
        ctx.moveTo(375,145);ctx.lineTo(385,155);ctx.moveTo(405,175);ctx.lineTo(415,185);
        ctx.moveTo(425,70);ctx.lineTo(445,110);ctx.moveTo(475,110);ctx.lineTo(455,150);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(809,366);ctx.lineTo(771,404);ctx.moveTo(859,416);ctx.lineTo(821,454);stroke("red");
        ctx.beginPath();ctx.moveTo(898,455);ctx.lineTo(898,535);stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 12) {
        ctx.beginPath();ctx.rect(120,270,120,60);ctx.rect(300,270,120,60);
        ctx.moveTo(480,330);ctx.lineTo(560,290);ctx.lineTo(640,330);ctx.lineTo(640,270);ctx.lineTo(560,230);ctx.lineTo(480,270);
        ctx.moveTo(680,330);ctx.lineTo(760,370);ctx.lineTo(840,330);ctx.lineTo(840,270);ctx.lineTo(760,310);ctx.lineTo(680,270);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(2,330);ctx.lineTo(480,330);ctx.lineTo(560,290);ctx.lineTo(640,330);ctx.lineTo(680,330);
		ctx.lineTo(760,370);ctx.lineTo(840,330);ctx.lineTo(900,330);
		ctx.moveTo(2,270);ctx.lineTo(480,270);ctx.lineTo(560,230);ctx.lineTo(640,270);ctx.lineTo(680,270);
        ctx.lineTo(760,310);ctx.lineTo(840,270);ctx.lineTo(900,270);
        ctx.moveTo(335,270);ctx.lineTo(335,295);ctx.moveTo(385,330);ctx.lineTo(385,305);ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(120,272);ctx.lineTo(120,328);ctx.moveTo(240,272);ctx.lineTo(240,328);
        ctx.moveTo(300,272);ctx.lineTo(300,328);ctx.moveTo(420,272);ctx.lineTo(420,328);ctx.moveTo(480,272);ctx.lineTo(480,328);
        ctx.moveTo(640,272);ctx.lineTo(640,328);ctx.moveTo(680,272);ctx.lineTo(680,328);ctx.moveTo(840,272);ctx.lineTo(840,328);stroke("red");
        ctx.beginPath();ctx.moveTo(898,273);ctx.lineTo(898,327);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 13) {
        ctx.beginPath();
        ctx.rect(165,140,25,25);ctx.rect(300,310,20,20);ctx.rect(370,280,20,20);ctx.rect(370,340,20,20);ctx.rect(440,310,20,20);ctx.rect(130,405,15,15);
        ctx.moveTo(50,320);ctx.lineTo(65,320);ctx.lineTo(100,300);ctx.moveTo(210,280);ctx.lineTo(175,300);ctx.moveTo(255,420);ctx.lineTo(310,450);
        ctx.moveTo(760,95);ctx.lineTo(795,140);ctx.lineTo(830,110);
        ctx.moveTo(2,280);ctx.lineTo(150,280);ctx.lineTo(150,200);ctx.lineTo(105,155);ctx.lineTo(180,80);ctx.lineTo(255,155);ctx.lineTo(210,200);
        ctx.lineTo(210,280);ctx.lineTo(255,280);ctx.lineTo(255,320);ctx.lineTo(120,320);ctx.lineTo(85,340);ctx.lineTo(215,420);ctx.lineTo(255,420);
        ctx.lineTo(255,280);ctx.lineTo(470,280);ctx.lineTo(520,305);ctx.lineTo(560,305);ctx.lineTo(640,225);ctx.lineTo(600,185);ctx.lineTo(690,95);
        ctx.lineTo(760,95);ctx.lineTo(760,25);
        ctx.moveTo(2,320);ctx.lineTo(50,320);ctx.lineTo(50,400);ctx.lineTo(232,512);ctx.lineTo(360,512);ctx.lineTo(360,420);ctx.lineTo(315,420);
        ctx.lineTo(315,360);ctx.lineTo(470,360);ctx.lineTo(520,335);ctx.lineTo(580,335);ctx.lineTo(690,225);ctx.lineTo(650,185);ctx.lineTo(690,145);
        ctx.lineTo(760,145);ctx.lineTo(780,175);ctx.lineTo(870,175);ctx.lineTo(870,95);ctx.lineTo(800,55);ctx.lineTo(800,25);
        ctx.moveTo(850,400);ctx.lineTo(850,350);ctx.lineTo(900,350);ctx.moveTo(810,400);ctx.lineTo(810,310);ctx.lineTo(900,310);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(762,27);ctx.lineTo(798,27);stroke("darkviolet");teleporter(50,367);
        ctx.beginPath();ctx.moveTo(812,398);ctx.lineTo(848,398);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(898,303);ctx.lineTo(898,347);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 14) {
    	ctx.beginPath();ctx.rect(360,180,40,70);ctx.rect(500,350,40,70);ctx.fill();
        ctx.beginPath();
        ctx.moveTo(60,300);ctx.bezierCurveTo(60,260,110,260,110,300);ctx.bezierCurveTo(110,340,60,340,60,300);
        ctx.moveTo(110,300);ctx.lineTo(123,270);ctx.lineTo(155,300);ctx.lineTo(123,330);ctx.lineTo(110,300);
        ctx.moveTo(2,260);ctx.lineTo(150,210);ctx.lineTo(137,240);ctx.lineTo(180,280);ctx.lineTo(250,280);ctx.lineTo(250,180);
        ctx.bezierCurveTo(250,85,400,85,400,180);ctx.lineTo(400,250);
        ctx.moveTo(2,340);ctx.lineTo(150,390);ctx.lineTo(137,360);ctx.lineTo(180,320);ctx.lineTo(290,320);ctx.lineTo(290,180);
        ctx.bezierCurveTo(290,130,360,130,360,180);ctx.lineTo(360,250);
        ctx.moveTo(840,300);ctx.bezierCurveTo(840,260,790,260,790,300);ctx.bezierCurveTo(790,340,840,340,840,300);
        ctx.moveTo(790,300);ctx.lineTo(777,270);ctx.lineTo(745,300);ctx.lineTo(777,330);ctx.lineTo(790,300);
        ctx.moveTo(898,340);ctx.lineTo(750,390);ctx.lineTo(763,360);ctx.lineTo(720,320);ctx.lineTo(650,320);ctx.lineTo(650,420);
        ctx.bezierCurveTo(650,515,500,515,500,420);ctx.lineTo(500,350);
        ctx.moveTo(898,260);ctx.lineTo(750,210);ctx.lineTo(763,240);ctx.lineTo(720,280);ctx.lineTo(610,280);ctx.lineTo(610,420);
        ctx.bezierCurveTo(610,470,540,470,540,420);ctx.lineTo(540,350);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(362,180);ctx.lineTo(398,180);ctx.moveTo(502,420);ctx.lineTo(538,420);stroke("red");
        ctx.beginPath();ctx.moveTo(362,248);ctx.lineTo(398,248);stroke("darkviolet");teleporter(140,110);
        ctx.beginPath();ctx.moveTo(502,352);ctx.lineTo(538,352);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(898,262);ctx.lineTo(898,338);ctx.closePath();stroke("lime");
        greenCollision = isPointInStroke();
    }
    if(lvl == 15) {
        ctx.beginPath();
        ctx.moveTo(2,280);ctx.quadraticCurveTo(60,280,60,220);ctx.moveTo(2,320);ctx.quadraticCurveTo(100,320,100,220);
        ctx.moveTo(700,580);ctx.quadraticCurveTo(700,520,640,520);ctx.moveTo(740,580);ctx.quadraticCurveTo(740,480,640,480);
        ctx.moveTo(260,240);ctx.bezierCurveTo(180,240,180,360,260,360);ctx.moveTo(260,200);ctx.bezierCurveTo(120,200,120,400,260,400);
        ctx.moveTo(620,180);ctx.quadraticCurveTo(680,180,680,120);ctx.moveTo(620,220);ctx.quadraticCurveTo(720,220,720,120);
        ctx.moveTo(680,120);ctx.quadraticCurveTo(680,20,780,20);ctx.moveTo(720,120);ctx.quadraticCurveTo(720,60,780,60);
        ctx.moveTo(360,320);ctx.quadraticCurveTo(420,320,420,380);ctx.moveTo(360,280);ctx.quadraticCurveTo(460,280,460,380);
        ctx.moveTo(150,420);ctx.lineTo(150,550);ctx.moveTo(110,420);ctx.lineTo(110,550);
        ctx.moveTo(420,450);ctx.quadraticCurveTo(420,510,360,510);ctx.moveTo(460,450);ctx.quadraticCurveTo(460,550,360,550);
        ctx.moveTo(300,110);ctx.quadraticCurveTo(240,110,240,50);ctx.moveTo(300,150);ctx.quadraticCurveTo(200,150,200,50);
        ctx.moveTo(840,380);ctx.quadraticCurveTo(840,320,900,320);ctx.moveTo(800,380);ctx.quadraticCurveTo(800,280,900,280);
        ctx.stroke();
        lvlCollision = isPointInStroke();
        ctx.beginPath();ctx.moveTo(62,222);ctx.lineTo(98,222);stroke("darkviolet");teleporter(640,350);
        ctx.beginPath();ctx.moveTo(702,578);ctx.lineTo(738,578);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(642,482);ctx.lineTo(642,518);stroke("darkviolet");teleporter(-390,-280);
        ctx.beginPath();ctx.moveTo(258,202);ctx.lineTo(258,238);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(258,362);ctx.lineTo(258,398);stroke("darkviolet");teleporter(370,-180);
        ctx.beginPath();ctx.moveTo(622,182);ctx.lineTo(622,218);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(778,22);ctx.lineTo(778,58);stroke("darkviolet");teleporter(-410,260);
        ctx.beginPath();ctx.moveTo(362,282);ctx.lineTo(362,318);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(422,378);ctx.lineTo(458,378);stroke("darkviolet");teleporter(-310,50);
        ctx.beginPath();ctx.moveTo(112,422);ctx.lineTo(148,422);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(112,548);ctx.lineTo(148,548);stroke("darkviolet");teleporter(310,-90);
        ctx.beginPath();ctx.moveTo(422,452);ctx.lineTo(458,452);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(362,512);ctx.lineTo(362,548);stroke("darkviolet");teleporter(-70,-400);
        ctx.beginPath();ctx.moveTo(298,112);ctx.lineTo(298,148);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(202,52);ctx.lineTo(238,52);stroke("darkviolet");teleporter(600,324);
        ctx.beginPath();ctx.moveTo(802,380);ctx.lineTo(838,380);stroke("darkviolet");
        ctx.beginPath();ctx.moveTo(898,282);ctx.lineTo(898,318);ctx.closePath();stroke("lime");
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
function teleporter(numx,numy) {
	if(ctx.isPointInStroke(player.x,player.y) || ctx.isPointInStroke(player.x-ry*2,player.y+rx*2) || 
    ctx.isPointInStroke(player.x+ry*2,player.y-rx*2)) {
	console.log("hi")
		player.x += numx;
		player.y += numy;
		for(var i=0;i<trail.length;i+=2) {
			trail[i] = player.x;
			trail[i+1] = player.y;
		}
    }
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