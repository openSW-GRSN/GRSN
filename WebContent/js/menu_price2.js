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

var path = 'Menu';		// 경로

// 선택된 메뉴
var firebase_menu_name = firebase.database().ref(path + '/cheese_burger/name');
var menu_name_print = document.getElementById("last_check_menu");
var menu_name;

firebase_menu_name.on('value', snap => {
	menu_name = snap.val();
	menu_name_print.innerHTML =
		"선택한 메뉴는 " + menu_name + "이며, 추가 요청사항을 다시 한 번 더 확인해주세요.";
	menu_name_print.style.fontWeight = "900";
});

// 사이드 메뉴(?) 추가
var firebase_material_add = firebase.database().ref(path + '/save_order');
var material_add_print = document.getElementById("total_added_ingredinet");
var material_add_bool;
var material_add = [];
var material_list_print;

firebase_material_add.get().then((data)=>{
	for(var i = 0; i < data.val().length; i++){
		material_add_bool = data.child(i).val();
		//console.log(material_add_bool);
		
		// material_add 배열에 이름을 부여
		switch(i){
			case 0:
			material_add[0] = "감자튀김(중)";
			break;
			
			case 1:
			material_add[1] = "음료(중)";
			break;
			
			case 2:
			material_add[2] = "케첩(+5개)";
			break;
			
			default:
			break;
		}
		// 값에 1이 들어있으면 재료를 추가
		if(material_add_bool == 1){
			// material_list_print에 값이 들어있으면,
			if(material_list_print){
				material_list_print = material_list_print + ', ' + material_add[i];
			}else{		// 값이 들어있지 않으면,
				material_list_print = material_add[i];
			}
		}
	}
	//console.log(material_list_print);
	// material_list_print에 아무런 값이 없을 때와 있을 때
	if(material_list_print == undefined){
		document.getElementById("total_added_ingredinet").innerHTML =
		"&nbsp&nbsp추가된 재료가 없습니다.&nbsp;&nbsp;";
	}else{
		document.getElementById("total_added_ingredinet").innerHTML =
			"&nbsp&nbsp추가된 재료:&nbsp" + material_list_print + "&nbsp;&nbsp;";
	}
});

// 가격 읽어오기
var firebase_menu_price = firebase.database().ref('total');
var price_print = document.getElementById("total_price2");
var price;

firebase_menu_price.on('value', snap =>{
	price = snap.val();
	price_print.innerHTML = "&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";
});
/*
document.getElementById("total_price2").innerHTML =
	"&nbsp&nbsp결제할 총 금액은 " + price + "원입니다.&nbsp&nbsp";
*/