// DOM fetchers
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("img-example"); // used to set startup image
image.addEventListener("load", (e) => {
    ctx.drawImage(image, 0, 0);
    drawCanvas(canvas, ctx, img1, xaxis, yaxis, xs, ys);
});

const img1 = document.createElement("img"); // used to remember the image on canvas
img1.src = image.src;

const outputTextArea = document.getElementById("output-textarea");

const stateSelector = document.getElementById("state-selector");

const xminInput = document.getElementById("xmin");
const xmaxInput = document.getElementById("xmax");
const yminInput = document.getElementById("ymin");
const ymaxInput = document.getElementById("ymax");

// System state
// Enum for the current mode
const States = Object.freeze({
    SETMINX: 0,
    SETMAXX: 1,
    SETMINY: 2,
    SETMAXY: 3,
    ADDPOINT: 4,
    DELPOINT: 5,
});

var state = States.SETMINX;

var xaxis = {x1: 120, x2: 950, y: 200};
var yaxis = {y1: 189, y2: 36, x: 110};

// Stores points
// var xs = [ 10,100,200,300];
// var ys = [100,100,50,50];
var xs = [];
var ys = [];

// Update editing state
stateSelector.addEventListener("change", function (e) {
    // Set global state
    const stateStr = e.target.value;
    console.log("Selected state:", e.target.value);
    if (stateStr === "xmin") {
        state = States.SETMINX;
    } else if (stateStr === "xmax") {
        state = States.SETMAXX;
    } else if (stateStr === "ymin") {
        state = States.SETMINY;
    } else if (stateStr === "ymax") {
        state = States.SETMAXY;
    } else if (stateStr === "Add points") {
        state = States.ADDPOINT;
    } else if (stateStr === "Delete points") {
        state = States.DELPOINT;
    }
});

// On paste event
document.onpaste = function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // might give you mime types
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (event) {
                img1.src = event.target.result;
                // ctx.drawImage(img1, 0, 0);
                drawCanvas(canvas, ctx, img1, xaxis, yaxis, xs, ys);
            } 
        }
    }
};

function plotLine(ctx, x1, y1, x2, y2, lineWidth=4, markSize=6) {
    // Line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
    // Markers
    ctx.beginPath();
    ctx.arc(x1, y1, markSize, 0, 2 * Math.PI);
    ctx.arc(x2, y2, markSize, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

function plotPoints(ctx, xs, ys, markSize=6) {
    for (let i = 0; i < xs.length; i++) {
        ctx.beginPath();
        const x = xs[i];
        const y = ys[i];
        ctx.arc(x, y, markSize, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
    }
}

function plotLines(ctx, xs, ys, lineWidth=4, markSize=6) {
    if (xs.length < 2) {
        plotPoints(ctx, xs, ys, markSize);
    }
    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        const x = xs[i];
        const y = ys[i];
        ctx.lineTo(x, y)
    }
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
    plotPoints(ctx, xs, ys, markSize);
}

function drawCanvas(canvas, ctx, img, xaxis, yaxis, xs, ys) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(img, 0, 0);
    plotLine(ctx, xaxis.x1, xaxis.y, xaxis.x2, xaxis.y);
    plotLine(ctx, yaxis.x, yaxis.y1, yaxis.x, yaxis.y2);
    plotLines(ctx, xs, ys);
}

function delPoint(xs, ys, x, y, r) {
    for (let i = 0; i < xs.length; i++) {
        const x1 = xs[i];
        const y1 = ys[i];
        const distance = Math.pow(x - x1,2) + Math.pow(y - y1,2);
        if (distance <= Math.pow(r, 2)) {
            xs.splice(i, 1);
            ys.splice(i, 1);
            return;
        }        
    }
}

// This function handles our entire program
function canvasClick(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if (state === States.SETMINX) {
        xaxis.x1 = x;
        xaxis.y  = y;
    } else if (state === States.SETMAXX) {
        xaxis.x2 = x;
        xaxis.y  = y;
    } else if (state === States.SETMINY) {
        yaxis.y1 = y;
        yaxis.x  = x;
    } else if (state === States.SETMAXY) {
        yaxis.y2 = y;
        yaxis.x  = x;
    } else if (state === States.ADDPOINT) {
        xs.push(x);
        ys.push(y);
    } else if (state === States.DELPOINT) {
        delPoint(xs, ys, x, y, 6);
    }
    console.log(state);
    // console.log("xs", xs);
    // console.log("ys", ys);
    drawCanvas(canvas, ctx, img1, xaxis, yaxis, xs, ys);
    // Set textbox content
    if (xs.length < 1) {
        outputTextArea.value = "";
        return;
    }
    var real_xs = "(";
    var real_ys = "(";
    for (let i = 0; i < xs.length; i++) {
        const x = xs[i];
        const y = ys[i];
        const pixel_dx = xaxis.x2 - xaxis.x1;
        const pixel_dy = yaxis.y2 - yaxis.y1;
        const xmin = xminInput.value;
        const xmax = xmaxInput.value;
        const ymin = yminInput.value;
        const ymax = ymaxInput.value;
        console.log(xmax)
        const real_x = ((x - xaxis.x1) / pixel_dx) * (xmax - xmin) + xmin;
        const real_y = ((yaxis.y2 - y) / pixel_dy) * (ymax - ymin) + ymin;
        console.log(real_x);
        real_xs = real_xs + real_x;
        real_ys = real_ys + real_y;
        if (i < xs.length - 1) {
            real_xs = real_xs + ", ";
            real_ys = real_ys + ", ";
        }
    }
    outputTextArea.value = real_xs + ")\n" + real_ys + ")";
}

canvas.addEventListener("mousedown", function (e) {
    canvasClick(canvas, e);
}); 
