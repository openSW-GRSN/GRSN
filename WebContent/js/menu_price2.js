// menu_price.js가 임포트 되지 않아 다시 여기서 연결한다 ^0^ (추후에 개선을 해야겠지만...)
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

var path = "test/치즈버거";		// 경로

// 선택된 메뉴
var firebase_menu_name = firebase.database().ref(path + '/name');
var menu_name_print = document.getElementById("last_check_menu");
var menu_name;

firebase_menu_name.on('value', snap => {
	menu_name = snap.val();
	menu_name_print.innerHTML =
		"선택한 메뉴는 " + menu_name + "이며, 추가 요청사항을 다시 한 번 더 확인해주세요.";
	menu_name_print.style.fontWeight = "900";
});



/*
document.getElementById("total_added_ingredinet").innerHTML =
	"&nbsp&nbsp추가된 재료:&nbsp" + final_save_list + "&nbsp;&nbsp;";
document.getElementById("total_price2").innerHTML =
	"&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";
*/