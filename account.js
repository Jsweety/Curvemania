function swapLog(id1,id2) {
	document.getElementById(id1).style.display = "block";
	document.getElementById(id2).style.display = "none";
	document.getElementById(id1+"-text").style.backgroundColor = "red";
	document.getElementById(id2+"-text").style.backgroundColor = "black";
	document.getElementById('login').reset();
	document.getElementById('register').reset();
}