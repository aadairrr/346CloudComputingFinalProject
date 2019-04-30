var userID;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAIspb6kBsmR9a4YqmwyC4pyI6eSkAo2F8",
    authDomain: "colorgame-4cfa6.firebaseapp.com",
    databaseURL: "https://colorgame-4cfa6.firebaseio.com",
    projectId: "colorgame-4cfa6",
    storageBucket: "colorgame-4cfa6.appspot.com",
    messagingSenderId: "876969312547"
};

firebase.initializeApp(config);
var db = firebase.firestore();
            
db.collection("pixels").onSnapshot(function(querySnapshot) {
    querySnapshot.docChanges().forEach(function(change) {
        if(change.type === "added"){
             addColor(change.doc.id, change.doc.data().color, change.doc.data().uid);
        }
        if (change.type === "modified") {
            addColor(change.doc.id, change.doc.data().color, change.doc.data().uid);
        }
    });
});
            
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    document.getElementById("name").innerHTML = user.displayName;
    document.getElementById("userPic").src = user.photoURL;
    userID = user.displayName;
}).catch(function(error) {
    var errorCor = error.code;
    var errorMessage = error.message;
})
            
function logOut(){
    firebase.auth().signOut().then(function() {
        console.log("sign out gud 2 go")
        window.location.reload(false); 
    }).catch(function(error) {
        console.log("sign out no bueno compadre")
    });
}