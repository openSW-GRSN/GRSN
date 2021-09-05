/**
 * 변수명 리스트
 * menu_name[CHAR]: 메뉴명 
 * price[INT]: 금액
 * count[INT]: 개수
 * Material_add[CHAR]: 고객의 기호에 맞게 추가하는 재료
 * Material_add_bool[BOOLEAN]: 들어가는 재료를 표시(0: 추가 안 함, 1: 추가함)
 * save_list[CHAR]: 클릭한 재료
 * final_save_list[CHAR]: 최종적으로 추가되는 재료들
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

var path = 'Menu/';		// 파이어베이스 루트 경로

var menu_name;			// 버거 이름
var price;				// 가격
var count;				// 수량
var Material_add = ['감자튀김(중)', '음료(중)', '케첩(+5)'];		// 추가 주문 가능한 목록 저장
var Material_add_bool = [];		// 추가 주문 가능한 목록 유무 판단(0: 추가X, 1: 추가)
var save_list = "";		// 추가 주문 가능한 목록 저장
var selectMenu = '';	// 메뉴명(영문)

// count 안을 확인해서 1 이상인 곳이 있으면 가져오기
var firebase_count_check = firebase.database().ref('Menu');
firebase_count_check.orderByChild('count').startAt(1).once('child_added', function(data){
    console.log(data.val());
    console.log(data.key);
	selectMenu = data.key;
	
	// firebase에서 가져오기(메뉴명)
	var firebase_menu_name = firebase.database().ref(path + selectMenu + '/name');
	var menu_name_print = document.getElementById("menu_name");
	
	firebase_menu_name.on('value', snap => {
		menu_name = snap.val();
		menu_name_print.innerHTML = "선택한 메뉴(" + menu_name + ")"
		menu_name_print.style.fontWeight = "900";
		menu_name_print.style.fontSize = "40px";
	});
	
	// 메뉴 소개글
	var menu_detail_print = document.getElementById("menu_detail");
	
	firebase_menu_name.on('value', snap =>{
				menu_detail_print.innerHTML = menu_name + "에 반드시 들어가는 재료 항목입니다."
				menu_detail_print.style.fontWeight = "900";
	});
	
	// 가격 읽어오기
	var firebase_menu_price = firebase.database().ref(path + selectMenu + '/price');
	var price_print = document.getElementById("total_price1");
	var total_price;
	
	firebase_menu_price.on('value', snap =>{
		price = snap.val();
		console.log(price);
		
		firebase.database().ref(path + selectMenu + '/count').on('value', snap=>{
			total_price = price * snap.val();
			firebase.database().ref('/total').set( total_price );
			price_print.innerHTML = "합계 금액: " + total_price + "원";
			price_print.style.fontWeight = "900";
		});
	});
	
	// 기본으로 들어가는 재료 읽어오기
	var firebase_menu_meterial_list = firebase.database().ref(path + selectMenu + '/Material_list');
	var meterial_list_print = document.getElementById("static_list");
	//console.log(firebase_menu_meterial_list.child());
	for(var i = 0; i < 4; i++){
		const staticSymbol = "ㅇ&nbsp";
		var firebase_menu_meterial_list_child = firebase_menu_meterial_list.child(i);
		var MaterialList;
		
		if(i == 0){
			firebase_menu_meterial_list_child.on('value', snap =>{
				MaterialList = snap.val();
				meterial_list_print.innerHTML = staticSymbol + MaterialList;
			});
		}else{
			firebase_menu_meterial_list_child.on('value', snap =>{
				MaterialList = snap.val();
				meterial_list_print.innerHTML =
					meterial_list_print.innerHTML + "<br/>" + staticSymbol + MaterialList;
			});
		}
	}
});

// 추가 가능한 재료
var firebase_menu_meterial_add = firebase.database().ref(path + '/Material_add');
var MaterialAdd;

// i = 0
var firebase_menu_meterial_add_child0 = firebase_menu_meterial_add.child(0);
var meterial_add_print0 = document.getElementById(0);

firebase_menu_meterial_add_child0.on('value', snap =>{
	MaterialAdd = snap.val();
	meterial_add_print0.childNodes[0].textContent = MaterialAdd;
});

// i = 1
var firebase_menu_meterial_add_child1 = firebase_menu_meterial_add.child(1);
var meterial_add_print1 = document.getElementById(1);

firebase_menu_meterial_add_child1.on('value', snap =>{
	MaterialAdd = snap.val();
	meterial_add_print1.childNodes[0].textContent = MaterialAdd;
});

// i = 2
var firebase_menu_meterial_add_child2 = firebase_menu_meterial_add.child(2);
var meterial_add_print2 = document.getElementById(2);

firebase_menu_meterial_add_child2.on('value', snap =>{
	MaterialAdd = snap.val();
	meterial_add_print2.childNodes[0].textContent = MaterialAdd;
});

// 추가할 재료 버튼
for(var i = 0; i < 3; i++){
	// 중복 체크가 되지 않도록 초기화
	Material_add_bool[i] = 0;
}

// 다음 페이지로 넘어갈지 확인
var firebase_page_check = firebase.database().ref('page_num');

firebase_page_check.on('value', snap =>{
		var page_num_test = snap.val();
		if(page_num_test == 7){
			nextPage.click();
		}
});

// 추가할 재료 버튼을 클릭했을 때 호출되는 함수
function addButtonClick(id){
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
	console.log(Material_add_bool);
	console.log(save_list);
	
	// 추가 주문 데베에 저장
	firebase.database().ref(path + 'save_order').set({
	    0: Material_add_bool[0],
	    1: Material_add_bool[1],
	    2: Material_add_bool[2]
	  });
}
