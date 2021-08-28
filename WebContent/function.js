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


