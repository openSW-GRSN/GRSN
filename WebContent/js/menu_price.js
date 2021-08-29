/**
 * 변수명 리스트
 * menu_name[CHAR]: 메뉴명 
 * price[INT]: 금액
 * count[INT]: 개수
 * Material_***[CHAR]: 재료
 * soldOut[BOOL]: 품절여부 (0: 수량 남음, 1: 품절)
 */

// defalut: 치즈버거(세트)
var menu_name = "치즈버거 세트";
var price = 5000;
var count = 1;
var Material_list = ['참깨빵 2장', '양상추', '치즈', '특별 소스'];
var Material_add = ['토마토', '치즈', '소스', '피클 두 배', '양파 두 배'];
var soldOut = false;

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
	for(var i=0; i<Material_list.length; i++){
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
		const btnString = "add_btn";
		
		document.getElementById(btnString+i).childNodes[0].textContent = Material_add[i];
	}
	
	// 맨 아래 가격
	// 목록을 데베에 저장해놓고 그냥 출력하는 방법도 있을 것 같다.	
	document.getElementById("total_price1").innerHTML = "합계 금액: " + price + "원";
}

// 버튼 동적 생성(제이쿼리 사용)
$(document).ready(function(){
	var str_html = '';
	
	// 버튼을 추가한다.
	for (var i = 0; i < Material_add.length; i++) {
		var html_btn = '<button id="add_btn" class="custom_button add_ingredient">{}</button>';
		html_btn = html_btn.replace('{}', Material_add[i]);
		str_html = str_html + html_btn + '\n';
	}
	
	$('#create_dynamic_btn').html(str_html);
	
	// 버튼 동적 연결
	$(document).on("click", "#add_btn", function(){
		// var idx = $(this).index();
		var idx = Material_add[$(this).index()];
		
		alert('{}'.replace('{}', idx))
	});

});

window.addEventListener('load', function() {
  // 마지막 총 금액
	document.getElementById("last_check_menu").innerHTML =
		"선택한 메뉴는 " + menu_name + "이며, 추가 요청사항을 다시 한 번 더 확인해주세요.";
	document.getElementById("last_check_menu").style.fontWeight = "900";

	document.getElementById("total_price2").innerHTML = "&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";
});