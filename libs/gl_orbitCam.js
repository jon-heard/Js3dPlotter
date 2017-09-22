
var mouseSensitivity = .05;

var view = mat4.create();
var rotX = 0;
var rotY = 0;
var onDraw;
var isMouseDown = false;
var prevMouseX = 0;
var prevMouseY = 0;

function orbitCam_init(canvas, pOnDraw)
{
	canvas.onmousedown = orbitCam_onMouseDown;
	document.onmouseup = orbitCam_onMouseUp;
	document.onmousemove = orbitCam_onMouseMove;
	onDraw = pOnDraw;
}

function orbitCam_getView()
{
	mat4.identity(view);
	mat4.translate(view, view, [0.0, 0.0, -7.0]);
	mat4.rotate(view, view, rotX, [0, 1, 0]);
	mat4.rotate(view, view, rotY, [1, 0, 0]);
	return view;
}

function orbitCam_onMouseDown(event)
{
	prevMouseX = event.clientX;
	prevMouseY = event.clientY;
	isMouseDown = true;
}

function orbitCam_onMouseUp(event)
{
	isMouseDown = false;
}

function orbitCam_onMouseMove(event)
{
	if (isMouseDown)
	{
		rotX += (event.clientX - prevMouseX) * mouseSensitivity;
		rotY += (event.clientY - prevMouseY) * mouseSensitivity;
		onDraw();
		prevMouseX = event.clientX;
		prevMouseY = event.clientY;
	}
}

