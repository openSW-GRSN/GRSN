// test.html 연결(지워도 되는 파일)
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
/*
// firebase에서 읽기
var demo = document.getElementById("demo");
var preObject = document.getElementById("object");
var dbRef = firebase.database().ref().child("object");

// test.html
dbRef.on('value',snap => demo.innerHTML = snap.val());
dbRef.on('value',snap => {
	preObject.innerText = JSON.stringify(snap.val(),null,3);
});
*/