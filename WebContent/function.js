var sales_cheeseburger=0;	//판매 수량
var sales_tomatoburger=0;
var sales_kebabburger=0;
var sales_doubleburger=0;



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
	
}
function cancel_sales_cheeseburger(){	//치즈버거 주문 취소
	sales_cheeseburger-=1;
	if (sales_cheeseburger<0){
		alert(alert_string);
		sales_cheeseburger+=1;
	}
	alert("치즈 버거 "+sales_cheeseburger+"개");

}

//케밥버거
function count_sales_kebabburger(){	//케밥버거 주문 개수
	sales_kebabburger+=1;
	alert("케밥 버거 "+sales_kebabburger+"개");

}
function cancel_sales_kebabburger(){	//케밥버거 주문 취소
	sales_kebabburger-=1;
	if (sales_kebabburger<0){
		alert(alert_string);
		sales_kebabburger+=1;
	}
	alert("케밥 버거 "+sales_kebabburger+"개");
}


//토마토 버거
function count_sales_tomatoburger(){	//토마토버거 주문 개수
	sales_tomatoburger+=1;
	alert("토마토 버거 "+sales_tomatoburger+"개");
}
function cancel_sales_tomatoburger(){	//토마토버거 주문 취소
	sales_tomatoburger-=1;
	if (sales_tomatoburger<0){
		alert(alert_string);
		sales_tomatoburger+=1;
	}
	alert("토마토 버거 "+sales_tomatoburger+"개");
}

//더블 버거
function count_sales_doubleburger(){	//더블버거 주문 개수
	sales_doubleburger+=1;
	alert("더블 버거 "+sales_doubleburger+"개");
}
function cancel_sales_doubleburger(){	//더블버거 주문 취소
	sales_doubleburger-=1;
	if (sales_doubleburger<0){
		alert(alert_string);
		sales_doubleburger+=1;
	}
	alert("더블 버거 "+sales_doubleburger+"개");
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


