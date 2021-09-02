/**
 * 변수명 리스트
 * menu_name[CHAR]: 메뉴명 
 * price[INT]: 금액
 * count[INT]: 개수
 * Material_add[CHAR]: 고객의 기호에 맞게 추가하는 재료
 * soldOut[BOOL]: 품절 여부 (0: 수량 남음, 1: 품절)
 * Material_add_bool[BOOLEAN]: 들어가는 재료를 표시(0: 추가 안 함, 1: 추가함)
 * save_list[CHAR]: 클릭한 재료
 * final_save_list[CHAR]: 최종적으로 추가되는 재료들
 */

/**
	불린 값은 변경이 잘 되지만 문자열로 변환하는 것이 어려움.
	시도는 해보겠지만 만약에 되지 않는다면 다음 창으로 값을 넘기는 방법(이것도 아직 모름)을 통해
	결과 창에서 불린 값이 1인 해당 재료를 표시하는 방법으로 진행할 것임.
	재료가 추가된 재료를 확인하는 방법으로는 불린 값이 1일 때 버튼 텍스트가 '추가'로 뜬다는 방법을 사용할 것임.
 */

// firebase 연결
var firebaseConfig = {
	apiKey: "AIzaSyAhWZp0H5loTHL92JtrXoCEFdwt8s9DDLY",
	authDomain: "grsn-43bdc.firebaseapp.com",
	databaseURL: "https://grsn-43bdc-default-rtdb.firebaseio.com",
	projectId: "grsn-43bdc",
	storageBucket: "grsn-43bdc.appspot.com",
	messagingSenderId: "592297355861",
	appId: "1:592297355861:web:244776f5d914a5c93c02dc",
	measurementId: "G-60XJK2NTE5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


//var menu_name = "더블버거";
var price = 5000;
var count = 1;
const Material_list = ['빵 2장', '패티', '양상추', '소스'];
var Material_add = ['감자튀김(중)', '음료(중)', '케찹+5'];
var Material_add_bool = [];
var soldOut = false;
var save_list = "";
var final_save_list = "submit add ingredient";
var text = [];		// 재료 수정 잘 되는지 확인

/**
 * 메뉴 선택 화면에서 선택된 메뉴 변수를 function.js import해서 읽어오거나
 * 파이어베이스에 저장시켜 값을 읽어오고 파이어베이스 내 데이터 검색 코드를 통해
 * 가격과 고정 재료들을 수정하는 쪽으로 코드를 구성해야 할 듯.
 */
/**
// 버거별 가격
if(menu_name == "불고기버거"){
	price = 5900;
}else if(menu_name == "토마토버거"){
	price = 6000;
}else if(menu_name == "더블버거"){
	price = 7500;
}else if(menu_name == "케밥버거"){
	price = 5000;
}else if(menu_name == "치즈버거"){
	price = 5000;
}
 */
//window.onload = function(){
// 상단 메뉴명
//document.getElementById("menu_name").innerHTML = "선택한 메뉴(" + menu_name + ")";

// firebase에서 가져오기(메뉴명)
var firebase_menu_name = firebase.database().ref().child("hamburger/치즈버거/name");
// 메뉴 이름 쓰는 div를 변수에 저장
var menu_name_print = document.getElementById("menu_name");

firebase_menu_name.on('value', snap =>
				menu_name_print.innerHTML = "선택한 메뉴(" + snap.val() + ")");
document.getElementById("menu_name").style.fontWeight = "900";
document.getElementById("menu_name").style.fontSize = "40px";

// 가격
// 추후에 입력 값에 따라 가격을 가져오는 코드(if문)로 수정할 예정
var firebase_menu_price = firebase.database().ref().child("hamburger/치즈버거/price");
var price_print = document.getElementById("total_price1");

firebase_menu_price.on('value', snap =>
				price_print.innerHTML = "합계 금액: " + snap.val() + "원");
document.getElementById("total_price1").style.fontWeight = "900";

// 수정할 수 없는 재료 목록
for(var i = 0; i < Material_list.length; i++){
	var staticSymbol = "ㅇ&nbsp";
	
	if(i == 0){
		document.getElementById("static_list").innerHTML = staticSymbol + Material_list[i];
	}else{
		document.getElementById("static_list").innerHTML
		= document.getElementById("static_list").innerHTML + "<br/>"
			+ staticSymbol + Material_list[i];
	}
}

// 재료 수정할 수 없는 칸의 메뉴명
//document.getElementById("menu_detail").innerHTML = menu_name + "에 반드시 들어가는 재료 항목입니다.";
var menu_detail_print = document.getElementById("menu_detail");
firebase_menu_name.on('value', snap =>
			menu_detail_print.innerHTML = snap.val() + "에 반드시 들어가는 재료 항목입니다.");
document.getElementById("menu_detail").style.fontWeight = "900";

// 추가할 재료 버튼
for(var i = 0; i < Material_add.length; i++){
	// 재료 동적으로 넣어주기
	document.getElementById(i).childNodes[0].textContent = Material_add[i];
	// 중복 체크가 되지 않도록 초기화
	Material_add_bool[i] = 0;
	// 추가되는 항목도 배열로 해주삼.
	text[i] = "0";
}

price = compute_count_menu(price, count);

// 맨 아래 가격
// 목록을 데베에 저장해놓고 그냥 출력하는 방법도 있을 것 같다.	
//document.getElementById("total_price1").innerHTML = "합계 금액: " + price + "원";
//document.getElementById("total_price1").style.fontWeight = "900";

// 불린 초기화 출력
//document.getElementById("boolean_test").innerHTML = Material_add_bool;
// 텍스트 배열
//document.getElementById("boolean_test").innerHTML = text;
//}

// 추가할 재료 버튼을 클릭했을 때 호출되는 함수
function btnClick(id){
	// 클릭 값이 있으면,
	if(save_list){
		// 쉼표를 넣어 구분한다.
		save_list = save_list + ", " + Material_add[id];
		
		// 클릭한 재료가 들어가지 않을 때
		if(Material_add_bool[id] == 0){
			// 들어간다고 표시
			Material_add_bool[id] = 1;
			
		}else{		// 클릭한 재료가 이미 추가되었을 때
			// 취소
			Material_add_bool[id] = 0;
		}
	// 최초로 값을 넣을 때
	}else{
		save_list = Material_add[id];
		// 무조건 처음 값은 1
		Material_add_bool[id] = 1;
	}
	
	// 클릭한 버튼 값 표시(누적)
	//document.getElementById("save_test").innerHTML = save_list;
	// 중복 클릭 방지
	//document.getElementById("boolean_test").innerHTML = Material_add_bool;
	// 함수 파라미터: 추가 가능한 재료 항목, 중복 추가 방지 불린 값
	//text = final_add_ingredient(Material_add, Material_add_bool);
	final_add_ingredient(Material_add, Material_add_bool);
}

// 1로 표시된 index에 해당하는 재료를 최종적으로 추가한다.
function final_add_ingredient(ingredient, bool){
	// bool의 개수에 맞게 for문 실행
	for(var i = 0; i < bool.length; i++){
		// 재료가 들어간다고 표시되면,
		if(bool[i] == 1){
			// final_save_list에 값을 넣는다.
			//final_save_list = ingredient[i];
			//document.getElementById("boolean_text").innerHTML = final_save_list;
			text[i] = ingredient[i];
			//document.getElementById("boolean_text").innerHTML = text;
		}else{
			// 왜 마지막 항목은 빠지지 않을까?
			text[i] = "0";
		}
	}
	// 최종적으로 저장된 값을 변수로 반환하여 다음 화면에 찍어주고 싶었다..
	//return final_save_list;
}
/*
window.addEventListener('load', function() {
	
});
*/

function compute_count_menu(price, count){
	return price*count;
}