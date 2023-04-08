var canvas,ctx;
var width,height;
var left,right;
var player = {
    x:0,y:0,size:8
};
var angle = 0;
var rx = 0,ry = 0;
var trail = [];
var start = true;
var fps = 100,fpsInterval,startTime,now,then,elapsed;
var cookies,cookie,playerCookie,patternsCookie,extrasCookie,colorsCookie,splitNumber;
var colors = ["red","blue","purple","green","cyan","orange","yellow","pink","white"];
var shape = ["square","round"],gap = [14,20,28,36],shadow = [0,10];

window.onload = function() {
    cookies();
    stylePatterns();
    styleExtras();
    styleColors();
    canvas = document.getElementById('small-canvas');
    ctx = canvas.getContext('2d');
    ctx.width = "300";
    width = ctx.width;
    ctx.height = "300";
    height = ctx.height;
    ctx.strokeStyle = "white";
    ctx.lineJoin='round'; 
    ctx.lineCap = "square";
    ctx.lineWidth = 4;
    ctx.fillStyle = "white";
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
function stylePatterns() {
    for(var i=0;i<4;i++) {
        if(patternsCookie[0] == i) document.getElementsByClassName('customize-range')[0].max = i;
        if(patternsCookie[1] == i) document.getElementsByClassName('customize-range')[1].max = i;
        if(playerCookie[0] == i) document.getElementsByClassName('customize-range')[0].value = i;
        if(playerCookie[1] == i) document.getElementsByClassName('customize-range')[1].value = i;
    }
}
function styleExtras() {
    if(extrasCookie[0] == "0") {
        document.getElementsByClassName('customize-div')[2].style.opacity = 0.2;
        document.getElementsByClassName('customize-checkbox')[0].disabled = true;
    }
    if(extrasCookie[1] == "0") {
        document.getElementsByClassName('customize-div')[3].style.opacity = 0.2;
        document.getElementsByClassName('customize-checkbox')[1].disabled = true;
    }
    if(playerCookie[2] == "1") document.getElementsByClassName('customize-checkbox')[0].checked = true;
    if(playerCookie[3] == "1") document.getElementsByClassName('customize-checkbox')[1].checked = true;
}
function styleColors() {
    for(var i=0;i<8;i++) {
        if(colorsCookie[i]=="0") {
            document.getElementsByClassName('customize-label')[i+1].style.filter = "blur(10px)";
            document.getElementsByClassName('customize-radio')[i+1].disabled = true;
        }
    }
    for(var i=0;i<9;i++) {
        if(playerCookie[4] == i) {
            document.getElementsByClassName('customize-radio')[i].checked = true;
        }
    }
}
function updatePlayer(n1,n2) {
    for(var i=0;i<9;i++) {
        document.getElementsByClassName('customize-radio')[i].blur();
        if(i<2) {
            document.getElementsByClassName('customize-range')[i].blur();
            document.getElementsByClassName('customize-checkbox')[i].blur();
        }
    }
    playerCookie = playerCookie.substring(0,n1) + n2 + playerCookie.substring(n1+1,5);
    document.cookie = "player="+playerCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
    splitNumber = parseInt(playerCookie[0]);
    styleColors();
}
function startDrawing(fps) {
    fpsInterval = 1000 / fps;
    then = window.performance.now();
    startTime = then;
    draw();
}
function draw(newtime) {
    now = newtime;
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.clearRect(0,0,width,height);
        startPosition();
        newPosition();
        drawTrail();
        drawRectangle();
        checkCollision();
    }
    requestAnimationFrame(draw);
}
function startPosition() {
    if(start) {
        player.x = 0;
        player.y = 150;
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
function checkCollision() {
    if(player.x > 300 || player.x < 0 || player.y > 300 || player.y < 0) trail = [];
    if(player.x > 300) player.x = 0;
    if(player.y > 300) player.y = 0;
    if(player.x < 0) player.x = 300;
    if(player.y < 0) player.y = 300;
}
function drawRectangle() {
    ctx.beginPath();
    ctx.rect(2,2,296,296);
    ctx.stroke();
}
document.onkeydown = function(e) {
    if(e.keyCode == 37) left = true,right = false;
    if(e.keyCode == 39) right = true,left = false;
}
document.onkeyup = function(e) {
    if(e.keyCode == 37) left = false;
    if(e.keyCode == 39) right = false;
}