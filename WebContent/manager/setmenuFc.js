var check;

//치즈버거 메뉴판에 추가 또는 빼기
function addCheeseburger(check){
	if(check==1){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu1").set("cheeseburger");
	}
	else if(check==2){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu1").remove();
	}
}

//더블버거 메뉴판에 추가 또는 빼기
function addDoubleburger(check){
	if(check==1){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu2").set("doubleburger");
	}
	else if(check==2){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu2").remove();
	}
}

//케밥버거 메뉴판에 추가 또는 빼기
function addKebabburger(check){
	if(check==1){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu3").set("kebabburger");
	}
	else if(check==2){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu3").remove();
	}
}

//치즈버거 메뉴판에 추가 또는 빼기
function addTomatoburger(check){
	if(check==1){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu4").set("tomatoburger");
	}
	else if(check==2){
		var dbRefObject = firebase.database().ref();
	    dbRefObject.child("setMenu/menu4").remove();
	}
}
