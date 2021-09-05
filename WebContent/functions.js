var sales_cheeseburger=0;	//판매 수량
var sales_tomatoburger=0;
var sales_kebabburger=0;
var sales_doubleburger=0;

var total_cheeseburger=0;		//그날의 판매수량


var today=new Date();
var alert_string="이미 0개 입니다!";



//치즈버거
function count_sales_cheeseburger(){	//치즈버거 주문 개수
	sales_cheeseburger+=1;
	alert("치즈 버거 "+sales_cheeseburger+"개");
	
	 var dbRefObject = firebase.database().ref();
     dbRefObject.child("Menu/cheese_burger/count").set(sales_cheeseburger);
    
}
function cancel_sales_cheeseburger(){	//치즈버거 주문 취소
	sales_cheeseburger-=1;
	if (sales_cheeseburger<0){
		alert(alert_string);
		sales_cheeseburger+=1;
	}
	alert("치즈 버거 "+sales_cheeseburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/cheese_burger/count").set(sales_cheeseburger);
}



//케밥버거
function count_sales_kebabburger(){	//케밥버거 주문 개수
	sales_kebabburger+=1;
	alert("케밥 버거 "+sales_kebabburger+"개");
	
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/kebab_burger/count").set(sales_kebabburger);

}
function cancel_sales_kebabburger(){	//케밥버거 주문 취소
	sales_kebabburger-=1;
	if (sales_kebabburger<0){
		alert(alert_string);
		sales_kebabburger+=1;
	}
	alert("케밥 버거 "+sales_kebabburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/kebab_burger/count").set(sales_kebabburger);
}


//토마토 버거
function count_sales_tomatoburger(){	//토마토버거 주문 개수
	sales_tomatoburger+=1;
	alert("토마토 버거 "+sales_tomatoburger+"개");
	
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/tomato_burger/count").set(sales_tomatoburger);
}
function cancel_sales_tomatoburger(){	//토마토버거 주문 취소
	sales_tomatoburger-=1;
	if (sales_tomatoburger<0){
		alert(alert_string);
		sales_tomatoburger+=1;
	}
	alert("토마토 버거 "+sales_tomatoburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/tomato_burger/count").set(sales_tomatoburger);
}

//더블 버거
function count_sales_doubleburger(){	//더블버거 주문 개수
	sales_doubleburger+=1;
	alert("더블 버거 "+sales_doubleburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/double_burger/count").set(sales_doubleburger);
}
function cancel_sales_doubleburger(){	//더블버거 주문 취소
	sales_doubleburger-=1;
	if (sales_doubleburger<0){
		alert(alert_string);
		sales_doubleburger+=1;
	}
	alert("더블 버거 "+sales_doubleburger+"개");
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("Menu/double_burger/count").set(sales_doubleburger);
}

//모든 손님들의 총 주문량

function sendSales(sales_cheeseburger){
	alert(sales_cheeseburger);	
}





//메뉴 추천 기능 만들기
var allergy_num;	//1: 육류알러지 2: 토마토 알러지 3: 유제품 알러지
//var recommended_menus=["kebabburger","tomatoburger","doubleburger","cheeseburger"]; 전체 메뉴

//알러지
function recommendation_allergy(allergy_num){
	if(allergy_num==1){	//육류 알러지인 경우
		writeAllergy2("meet","cheeseburger","tomatoburger");
		writeAllergyNum(1);
	}
	else if(allergy_num==2){	//토마토 알러지인 경우
		writeAllergy3("tomato","cheeseburger","kebabburger","doubleburger");
		writeAllergyNum(2);
	}
	else if(allergy_num==3){	//유제품 알러지인 경우
		writeAllergy3("milk","kebabburger","tomatoburger","doubleburger");
		writeAllergyNum(3);
	}
	else{
		alert("오류");
	}
}

//알러지에 따른 추천 메뉴를 db에 저장-추천메뉴2개인 경우
function writeAllergy2(allergy,menu1, menu2){
	firebase.database().ref('allergyMenu/'+allergy).set({
		recommend1:menu1,
		recommend2:menu2
	});
}
//추천menu가 3개인 경우
function writeAllergy3(allergy,menu1, menu2,menu3){
	firebase.database().ref('allergyMenu/'+allergy).set({
		recommend1:menu1,
		recommend2:menu2,
		recommend3:menu3
	});
}
//allergynum값 넘기기
function writeAllergyNum(allergy_num){
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("allergyNum").set(allergy_num);
}

//입맛

function writeTasteMenu(taste_menu){
	var dbRefObject = firebase.database().ref();
    dbRefObject.child("tasteMenu").set(taste_menu);
}


function recommendation_taste(taste){	//1:fresh, 2:hot, 3:simple
	if(taste==1){
		if(demo.innerHTML==1){	//육류 알러지
			writeTasteMenu("토마토버거");
		}
		else if(demo.innerHTML==2){	//토마토 알러지
			writeTasteMenu("치즈버거");
		}
		else{	//유제품 알러지
			writeTasteMenu("토마토버거");
		}
	}
	else if(taste==2){	//매운맛
		if(demo.innerHTML==1){	//육류알러지
			writeTasteMenu("토마토버거");
		}
		else if(demo.innerHTML==2){	//토마토 알러지
			writeTasteMenu("케밥버거");
		}
		else{	//유제품 알러지
			writeTasteMenu("더블버거");
		}
	}
	else if(taste==3){	//담백한 맛
		if(demo.innerHTML==1){	//육류알러지
			writeTasteMenu("치즈버거");
		}
		else if(demo.innerHTML==2){	//토마토알러지
			writeTasteMenu("치즈버거");
		}
		else{	//유제품 알러지
			writeTasteMenu("토마토버거");
		}
	}
}
	
//추천메뉴 result창 함수


//오늘의 추천 메뉴
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
