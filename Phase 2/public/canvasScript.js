var mouseDown = 0;
document.onmousedown = function() {
    console.log("mouse down!!21!");
  ++mouseDown;
}
document.onmouseup = function() {
  --mouseDown;
}
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
    
    var user = document.getElementById("userName");
    user.style.left = event.pageX-50;
    user.style.top = event.pageY-35;

    
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
    for(i=0;i<20;i++){
        for(j=0;j<20;j++){
            var pixel = document.createElement("div");
            pixel.className = "pixel";
            pixel.id = "" + i + "," + j;
            pixel.setAttribute("onmousemove", "addColorLocal(this.id)");
            var pixelName = document.createElement("span");
            pixel.appendChild(pixelName);
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
    console.log("moving");
    if(document.getElementById(clickedID).firstChild.innerHTML.length > 0
      && document.getElementById(clickedID).firstChild.innerHTML!=userID){
        document.getElementById("userName").innerHTML = "Set by: " + document.getElementById(clickedID).firstChild.innerHTML;
    }else{
        document.getElementById("userName").innerHTML = "";
    }
    if(mouseDown==1){
        console.log("mouse down");
        var fillColor = document.getElementById("mine").style.backgroundColor;
        if(fillColor != document.getElementById(clickedID).style.backgroundColor){
            db.collection("pixels").doc(clickedID).set({
                color:fillColor,
                uid:userID 
            }).then(function(docRef) {
                console.log("Document written with ID: ", clickedID);
            }).catch(function(error) {
                console.error("Error adding document: ", error);
            });
            addColor(clickedID, fillColor, userID);
            console.log(clickedID + " was clicked");
        }
    }
}

/*
*
* Function: addColor
*
* Purpose:  Changes the color for the pixel passed in
*/
function addColor(clickedID, newColor, uid){
    document.getElementById(clickedID).style.backgroundColor = newColor;
    document.getElementById(clickedID).firstChild.innerHTML = uid;
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