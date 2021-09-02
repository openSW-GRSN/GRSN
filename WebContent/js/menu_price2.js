/**
 * 
 */

document.getElementById("last_check_menu").innerHTML =
	"선택한 메뉴는 " + menu_name + "이며, 추가 요청사항을 다시 한 번 더 확인해주세요.";
	document.getElementById("last_check_menu").style.fontWeight = "900";

	document.getElementById("total_added_ingredinet").innerHTML =
		"&nbsp&nbsp추가된 재료:&nbsp" + final_save_list + "&nbsp;&nbsp;";
	document.getElementById("total_price2").innerHTML = "&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";