/*
*
* Function:  handleMouseMove
*
* Purpose:   Tracks the mouse postion on the screen
*           Updates a circle behind the mouse to
*           signify what color is currently in use
*/
document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    var eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);

        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    
    var div = document.getElementById('mine');
    div.style.left = event.pageX-25;
    div.style.top = event.pageY-25;
}

/*
*
* Function:  logOut
*
* Purpose:   Logs the user out and refreshes page back to main login
*
*/
function logOut(){
    //Set cookie expiration to the past to delete
    setCookie("username", getCookie("username"), -1);
    //refresh page
    window.location.reload()
}

/*
*
* Function: setCookie
*
* Purpose:  Sets the cookie key="name" with value
*           to remain logged in on refresh
*/
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/*
*
* Function: getCookie
*
* Purpose:  Retrieves the username saved from previous sessions
*/
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*
*
* Function: checkCookie
*
* Purpose:  Checks if there is a saved cookie from
*           previous sessions, otherwise it asks
*           for the user to log in
*/
function checkCookie() {
    var user=getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:","");
        if (user != "" && user != null) {
            setCookie("username", user, 30);
        }
    }
    
    var div = document.getElementById('name');
    div.innerHTML = getCookie("username");
    setGrid();
}

/*
*
* Function: setGrid
*
* Purpose:  Initializes a blank grid of DIVs
*           (no color is added to the grid here)
*           The DIVs get an ID equal to their location x,y
*           The DIVs get an onClick event to trigger colorChange
*           
*           Also defines the colors available to use
*/
function setGrid(){
    var i, j;
    for(i=0;i<50;i++){
        for(j=0;j<50;j++){
            var pixel = document.createElement("div");
            pixel.className = "pixel";
            pixel.id = "" + i + "," + j;
            pixel.setAttribute("onclick", "addColorLocal(this.id)");
            document.getElementById("canvas").appendChild(pixel);
        }
    }
    var colors = ["blue","red","yellow",
                  "green","purple","orange",
                  "pink","cyan", "maroon",
                  "white","black","grey"]
    colors.forEach(function(thisColor){
        console.log(thisColor);
        var color = document.createElement("div");
        color.className = "color";
        color.id = thisColor;
        color.style = "background-color:"+thisColor;
        color.setAttribute("onclick", "changeColor(this.id)")
        document.getElementById("colorContainer").appendChild(color);
    });
}

/*
*
* Function: addColorLocal
*
* Purpose:  Called when a pixel is clicked, checks the currently
*           selected color and sends it to the database before 
*           passing it to addColor()
*/
function addColorLocal(clickedID){
    var fillColor = document.getElementById("mine").style.backgroundColor;

    db.collection("pixels").doc(clickedID).set({
        color:fillColor
    }).then(function(docRef) {
        console.log("Document written with ID: ", clickedID);
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });

    addColor(clickedID, fillColor);
    console.log(clickedID + " was clicked");
}

/*
*
* Function: addColorLocal
*
* Purpose:  Changes the color for the pixel passed in
*/
function addColor(clickedID, newColor){
    document.getElementById(clickedID).style.backgroundColor = newColor;
    console.log(clickedID + " was updated");
}

/*
*
* Function: changeColor
*
* Purpose:  Changes the color currently in use
*/
function changeColor(clickedID){
    document.getElementById("mine").style.backgroundColor = clickedID;
    console.log(clickedID);
}