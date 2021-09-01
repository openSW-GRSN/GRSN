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

// defalut: 치즈버거(세트)
var menu_name = "더블버거 세트";
var price = 5000;
var count = 1;
const Material_list = ['참깨빵 2장', '양상추', '치즈', '특별 소스'];
var Material_add = ['토마토', '치즈', '소스', '피클 두 배'];
var Material_add_bool = [];
var soldOut = false;
var save_list = "add ingredient";
var final_save_list = "submit add ingredient";

if(menu_name == "불고기버거 세트"){
	price = 5900;
}else if(menu_name == "토마토버거 세트"){
	price = 6000;
}else if(menu_name == "더블버거 세트"){
	price = 7500;
}else if(menu_name == "케밥버거 세트"){
	price = 5000;
}

window.onload = function(){
// 상단 메뉴명
	document.getElementById("menu_name").innerHTML = "선택한 메뉴(" + menu_name + ")";
	document.getElementById("menu_name").style.fontWeight = "900";
	document.getElementById("menu_name").style.fontSize = "40px";
	
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
	document.getElementById("menu_detail").innerHTML = menu_name + "에 반드시 들어가는 재료 항목입니다.";
	document.getElementById("menu_detail").style.fontWeight = "900";
	
	// 추가할 재료 버튼
	for(var i = 0; i < Material_add.length; i++){
		document.getElementById(i).childNodes[0].textContent = Material_add[i];
		Material_add_bool[i] = 0;
	}
	// 맨 아래 가격
	// 목록을 데베에 저장해놓고 그냥 출력하는 방법도 있을 것 같다.	
	document.getElementById("total_price1").innerHTML = "합계 금액: " + price + "원";
	document.getElementById("total_price1").style.fontWeight = "900";
	
	document.getElementById("boolean_test").innerHTML = Material_add_bool;
}

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
	
	document.getElementById("save_test").innerHTML = save_list;
	document.getElementById("boolean_test").innerHTML = Material_add_bool;
	
	text = final_add_ingredient(Material_add, Material_add_bool);
	document.getElementById("boolean_text").innerHTML = text;
	System.out.println(final_save_list);
}

// 1로 표시된 index에 해당하는 재료를 최종적으로 추가한다.
function final_add_ingredient(ingredient, bool){
	// bool의 개수에 맞게 for문 실행
	for(var i = 0; i < bool.length; i++){
		// 재료가 들어간다고 표시되면,
		if(bool[i] == 1){
			// final_save_list에 값을 넣는다.
			final_save_list = ingredient[i];
		}
	}
	return final_save_list;
}

window.addEventListener('load', function() {
	document.getElementById("last_check_menu").innerHTML =
		"선택한 메뉴는 " + menu_name + "이며, 추가 요청사항을 다시 한 번 더 확인해주세요.";
	document.getElementById("last_check_menu").style.fontWeight = "900";

	document.getElementById("total_added_ingredinet").innerHTML =
		"&nbsp&nbsp추가된 재료:&nbsp" + final_save_list + "&nbsp;&nbsp;";
	document.getElementById("total_price2").innerHTML = "&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";
});