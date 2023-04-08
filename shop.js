var cookies,cookie,playerCookie,patternsCookie,extrasCookie,colorsCookie,defaultText;

window.onload = function() {
	cookies();
	updateText();
}
function cookies() {
	cookies = document.cookie.replace(/\s+/g, '');
	cookie = cookies.split(/[=;]/);
	patternsCookie = cookie[cookie.indexOf("patterns")+1];
	extrasCookie = cookie[cookie.indexOf("extras")+1];
	colorsCookie = cookie[cookie.indexOf("colors")+1];
}
function updateText() {
	for(var i=0;i<document.getElementsByClassName('color-text').length;i++) {
		defaultText = document.getElementsByClassName('color-text')[i].innerHTML;
		document.getElementsByClassName('color-text')[i].innerHTML = colorsCookie[i] == 1 ? "Owned" : defaultText;
	}
	for(var i=0;i<document.getElementsByClassName('extra-text').length;i++) {
		defaultText = document.getElementsByClassName('extra-text')[i].innerHTML;
		document.getElementsByClassName('extra-text')[i].innerHTML = extrasCookie[i] == 1 ? "Owned" : defaultText;
	}
	for(var i=0;i<document.getElementsByClassName('pattern-text').length;i++) {
		defaultText = document.getElementsByClassName('pattern-text')[i].innerHTML;
		document.getElementsByClassName('pattern-text')[i].innerHTML = patternsCookie[i] == 3 ? "Maxed" : defaultText;
	}
}
function popup(question,className,num) {
	if((document.getElementsByClassName(className)[num].innerHTML != "Owned" && className != "pattern-text") ||
		(className == "pattern-text" && patternsCookie[num] < 3)) {
		document.getElementById('background').style.display = "block";
		document.getElementById('popup').style.display = "block";
		document.getElementById('message').innerHTML = question;
		string = question;
	}
}
function buySkin() {
	if(string.includes("200")) {
		if(string.includes("blue")) {
			colorsCookie = "1" + colorsCookie.substring(1,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("purple")) {
			colorsCookie = colorsCookie.substring(0,1) + "1" + colorsCookie.substring(2,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("green")) {
			colorsCookie = colorsCookie.substring(0,2) + "1" + colorsCookie.substring(3,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("cyan")) {
			colorsCookie = colorsCookie.substring(0,3) + "1" + colorsCookie.substring(4,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("orange")) {
			colorsCookie = colorsCookie.substring(0,4) + "1" + colorsCookie.substring(5,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("yellow")) {
			colorsCookie = colorsCookie.substring(0,5) + "1" + colorsCookie.substring(6,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("pink")) {
			colorsCookie = colorsCookie.substring(0,6) + "1" + colorsCookie.substring(7,8);
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("white")) {
			colorsCookie = colorsCookie.substring(0,7) + "1";
			document.cookie = "colors="+colorsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
	}
	if(string.includes("1000")) {
		if(string.includes("split")) {
			patternsCookie = (parseInt(patternsCookie[0])+1) + patternsCookie.substring(1,2);
			document.cookie = "patterns="+patternsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("gap")) {
			patternsCookie = patternsCookie.substring(0,1) + (parseInt(patternsCookie[1])+1);
			document.cookie = "patterns="+patternsCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
	}
	if(string.includes("2500")) {
		if(string.includes("circular")) {
			extrasCookie = "1" + extrasCookie.substring(1,2);
			document.cookie = "extras="+extrasCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
		if(string.includes("shadow")) {
			extrasCookie = extrasCookie.substring(0,1) + "1";
			document.cookie = "extras="+extrasCookie+";sameSite=Lax;expires=Thu, 01 Jan 2026 00:00:00 UTC;";
		}
	}
	hidePopup();
	updateText();
}
function hidePopup() {
	document.getElementById('background').style.display = "none";
	document.getElementById('popup').style.display = "none";
}
document.onkeydown = function(e) {
    if(e.keyCode == 27) hidePopup();
}