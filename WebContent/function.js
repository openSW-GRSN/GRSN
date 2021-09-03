var sales_cheeseburger=0;	//판매 수량
var sales_tomatoburger=0;
var sales_kebabburger=0;
var sales_doubleburger=0;

var text="";
var recommend_select_hamburger='';


var today=new Date();
var alert_string="이미 0개 입니다!";

var total_sales=sales_cheeseburger+sales_tomatoburger+sales_doubleburger+sales_kebabburger;



function sendSales(){
	location.href="test.html?치즈버거: "+sales_cheeseburger;
	
}


	

//치즈버거
function count_sales_cheeseburger(){	//치즈버거 주문 개수
	
	sales_cheeseburger+=1;
	alert("치즈 버거 "+sales_cheeseburger+"개");
	
	 var dbRefObject = firebase.database().ref();
     dbRefObject.child("sales_cheeseburger").set(sales_cheeseburger);
}
function cancel_sales_cheeseburger(){	//치즈버거 주문 취소
	sales_cheeseburger-=1;
	if (sales_cheeseburger<0){
		alert(alert_string);
		sales_cheeseburger+=1;
	}
	alert("치즈 버거 "+sales_cheeseburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_cheeseburger").set(sales_cheeseburger);

}

//케밥버거
function count_sales_kebabburger(){	//케밥버거 주문 개수
	sales_kebabburger+=1;
	alert("케밥 버거 "+sales_kebabburger+"개");
	
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_kebabburger").set(sales_kebabburger);

}
function cancel_sales_kebabburger(){	//케밥버거 주문 취소
	sales_kebabburger-=1;
	if (sales_kebabburger<0){
		alert(alert_string);
		sales_kebabburger+=1;
	}
	alert("케밥 버거 "+sales_kebabburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_kebabburger").set(sales_kebabburger);
}


//토마토 버거
function count_sales_tomatoburger(){	//토마토버거 주문 개수
	sales_tomatoburger+=1;
	alert("토마토 버거 "+sales_tomatoburger+"개");
	
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_tomatoburger").set(sales_tomatoburger);
}
function cancel_sales_tomatoburger(){	//토마토버거 주문 취소
	sales_tomatoburger-=1;
	if (sales_tomatoburger<0){
		alert(alert_string);
		sales_tomatoburger+=1;
	}
	alert("토마토 버거 "+sales_tomatoburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_tomatoburger").set(sales_tomatoburger);
}

//더블 버거
function count_sales_doubleburger(){	//더블버거 주문 개수
	sales_doubleburger+=1;
	alert("더블 버거 "+sales_doubleburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_doubleburger").set(sales_doubleburger);
}
function cancel_sales_doubleburger(){	//더블버거 주문 취소
	sales_doubleburger-=1;
	if (sales_doubleburger<0){
		alert(alert_string);
		sales_doubleburger+=1;
	}
	alert("더블 버거 "+sales_doubleburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("sales_doubleburger").set(sales_doubleburger);
}

//모든 손님들의 총 주문량

var all_sales_cheeseburger;
function count_all_sales(){
	
}




//메뉴 추천 기능 만들기
var alergy_num;
var taste;
var recommended_menus=["tomatoburger","cheeseburger","doubleburger","kebabburger"];


//알러지
function recommendation_alergy(alergy_num){
	if(alergy_num=="meat"){
		//육류 선택시
		recommended_menus.splice(2,2);
		alert(recommended_menus); //확인용
		location.href="alergy_meat.html?"+recommended_menu;
		
	}

	else if(alergy_num=="tomato"){
		recommended_menus.splice(0,1);
		alert(recommended_menus);
		location.href="alergy_tomato.html?"+recommended_menu;
	}
		
	else if (alergy_num=="milk"){
		recommended_menus.splice(1,1);
		alert(recommended_menus);
		location.href="alergy_milk.html?"+recommended_menu;
	
	}

}

//입맛
function recommendation_taste(taste){

	if(taste=="hot"){
		if(recommended_menus.includes('doubleburger')||recommended_menus.includes('kebabburger')){
			recommended_menus=["doubleburger","kebabburger"];
			alert(recommended_menus);
		}
		else{
			alert("죄송합니다. 해당하는 메뉴가 없습니다.");
		}
	}
	else if(taste=="simple"){
		if(recommended_menus.includes('cheeseburger')){
			recommended_menus=["cheeseburger"];
			alert(recommended_menus);
		}
		else{
			alert("죄송합니다. 해당하는 메뉴가 없습니다.");
		}
	}
	else if(taste=="fresh"){
		if(recommended_menus.includes('tomatoburger')){
			recommended_menus=["tomatoburger"];
			alert(recommended_menus);
		}
		else{
			alert("죄송합니다. 해당하는 메뉴가 없습니다.");
		}
	}
}

function recommend_cheese_burger(){
	recommend_select_hamburger = "cheese burger";
	alert("치즈 버거가 선택되었습니다.");
}

function recommend_double_burger(){
	recommend_select_hamburger =  "double burger";
	alert("더블 버거가 선택되었습니다.");
}

function recommend_kebab_burger(){
	recommend_select_hamburger = "kebab burger";
	alert("케밥 버거가 선택되었습니다.");
}

function recommend_tomato_burger(){
	recommend_select_hamburger = "tomato burger";
	alert("토마토 버거가 선택되었습니다.");
}

function recommend_manager(){	// 여기서 해야할 일 == 버튼 누르면 추천 문구가 db에 저장이 되어야한다!

	valueInVar = document.getElementById("inputbox").value;
	alert("DB에 반영되었습니다!");
	
	var dbRefObject = firebase.database().ref('recommend');
    dbRefObject.child("recommend_ment").set(valueInVar);
	dbRefObject.child("recommend_hamburger").set(recommend_select_hamburger);
}
