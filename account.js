function swapLog(id1,id2) {
	document.getElementById(id1).style.display = "block";
	document.getElementById(id2).style.display = "none";
	document.getElementById(id1+"-text").style.backgroundColor = "red";
	document.getElementById(id2+"-text").style.backgroundColor = "black";
	document.getElementById('login').reset();
	document.getElementById('register').reset();
}
function showPsw(id) {
	if(document.getElementById(id).type == "text") document.getElementById(id).type = "password";
	else document.getElementById(id).type = "text";
}
function checkPsw() {
	var input = document.getElementById('password-repeat');
	input.setCustomValidity('');
	if(input.value != document.getElementById('password').value) input.setCustomValidity('Password must be matching');
	else input.setCustomValidity('');
}