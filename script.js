const canvas = document.querySelector("canvas");
toolBtns = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fill-color")
sizeSlider = document.querySelector("#size-slider")
colorBtns = document.querySelectorAll(".colors .option")
colorPicker = document.querySelector("#color-picker")
clearCanvas = document.querySelector(".clear-canvas")
saveImg = document.querySelector(".save-img")

ctx = canvas.getContext("2d");

// global variables with default value
let pervMouseX, pervMouseY , snapshot
let isDrawing = false; 
selectedTool = "brush"
brushWidth = 5;

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor;
}


window.addEventListener("load", () => {
    // setting canvas width/hight... offsetwidth/height return viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();

});




const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX,e.offsetY,pervMouseX - e.offsetX,pervMouseY - e.offsetY)

    }
    ctx.fillRect(e.offsetX,e.offsetY,pervMouseX - e.offsetX,pervMouseY - e.offsetY)

}

const drawCircle = (e) => {
    ctx.beginPath(); //
    // getting the radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((pervMouseX - e.offsetX), 2) + Math.pow((pervMouseY - e.offsetY), 2));
    ctx.arc(pervMouseX, pervMouseY, radius, 0, 2 * Math.PI); //creating circle according to the mouse pointer
    fillColor.checked ?ctx.fill() : ctx.stroke() // if fillColor is checked fill circle else draw border circle.
}


const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(pervMouseX, pervMouseY); //moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to the mouse pointer
    ctx.lineTo(pervMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath() // closing  path of a triangle so the third line draw automatically
    fillColor.checked ?ctx.fill() : ctx.stroke() // if fillColor is checked fill triangle else draw border circle.
    
}

const startDraw = (e) => {
    pervMouseX = e.offsetX; //passing current mouseX position 
    pervMouseY = e.offsetY; //passing current mouseY position 
    isDrawing = true;
    ctx.beginPath();
    ctx.lineWidth = brushWidth; //passing Brush Size as line width
    // copying canvas data & passing as snapshot value. this avoids dragging the image
    ctx.strokeStyle = selectedColor;  //passing  selected Color as fill style
    ctx.fillStyle = selectedColor; //passing selected Color
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

}


const drawing = (e) => {
    if (!isDrawing) return; // if isDrawing is false return from here
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas
    if (selectedTool == "brush" || selectedTool == "eraser") {
        //    if selected tool is eraser then set strokestyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool == "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);  //Creating line according to the mouse pointer.
        ctx.stroke()//drawing/filing line with color.
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    }
    else if (selectedTool === "circle") {
        drawCircle(e);
    }
    else {
        drawTriangle(e);
    }
    

}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active")
        btn.classList.add("active")
        selectedTool = btn.id;
        console.log(selectedTool)
    })
})

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value)

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        // Pass
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });

});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click()
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clearing whole canvas
    setCanvasBackground()
    
})
saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; //passing current date as link download value
    link.href = canvas.toDataURL(); //passing canvasData as link href value
    link.click(); //clicking link to download image
})



canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove",drawing)
canvas.addEventListener("mouseup",() => isDrawing = false)