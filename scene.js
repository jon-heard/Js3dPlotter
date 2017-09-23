
var orbitCam;
var mainCanvas;
var gl;
var mainShader;
var matProjection = mat4.create();
var matModelView = mat4.create();
var triPositionBuffer;
var triColorBuffer;
var rectPositionBuffer;
var rectColorBuffer;

function scene_initGL(canvas)
{
	mainCanvas = canvas;
	try
	{
		gl = mainCanvas.getContext("experimental-webgl");
	}
	catch (e)
	{}
	if (!gl)
	{
		alert("Unable to initialise WebGL");
	}
}

function scene_initShaders()
{
	mainShader = gl_buildShaderProgram(shader_vert_main, shader_frag_main);
	gl.useProgram(mainShader);
	mainShader.vertPosition = gl.getAttribLocation(mainShader, "vertPosition");
	gl.enableVertexAttribArray(mainShader.vertPosition);
	mainShader.vertColor = gl.getAttribLocation(mainShader, "vertColor");
	gl.enableVertexAttribArray(mainShader.vertColor);
	mainShader.matProjection = gl.getUniformLocation(mainShader, "matProjection");
	mainShader.matModelView = gl.getUniformLocation(mainShader, "matModelView");
}

function scene_initGeometry()
{
	triPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triPositionBuffer);
	var vertices =
	[
		0.0,  1.0,  0.0,
		-1.0, -1.0,  0.0,
		1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triPositionBuffer.itemSize = 3;
	triPositionBuffer.numItems = 3;

	triColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triColorBuffer);
	var colors =
	[
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triColorBuffer.itemSize = 4;
	triPositionBuffer.numItems = 3;


	rectPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rectPositionBuffer);
	vertices =
	[
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	rectPositionBuffer.itemSize = 3;
	rectPositionBuffer.numItems = 3;

	rectColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rectColorBuffer);
	var colors =
	[
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	rectColorBuffer.itemSize = 4;
	rectColorBuffer.numItems = 3;
}

var rot = 0;

function scene_draw()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.copy(matModelView, orbitCam.getView());

	mat4.translate(matModelView, matModelView, [-1.5, 0.0, 0.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, triPositionBuffer);
	gl.vertexAttribPointer(mainShader.vertPosition, triPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, triColorBuffer);
	gl.vertexAttribPointer(mainShader.vertColor, triColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(mainShader.matProjection, false, matProjection);
	gl.uniformMatrix4fv(mainShader.matModelView, false, matModelView);
	gl.drawArrays(gl.TRIANGLES, 0, triPositionBuffer.numItems);

	mat4.translate(matModelView, matModelView, [3.0, 0.0, 0.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, rectPositionBuffer);
	gl.vertexAttribPointer(mainShader.vertPosition, rectPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.bindBuffer(gl.ARRAY_BUFFER, rectColorBuffer);
	gl.vertexAttribPointer(mainShader.vertColor, rectColorBuffer.itemSize, gl.FLOAT, false, 0, 0);	
	gl.uniformMatrix4fv(mainShader.matProjection, false, matProjection);
	gl.uniformMatrix4fv(mainShader.matModelView, false, matModelView);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, rectPositionBuffer.numItems);
}

function tick()
{
	var width  = mainCanvas.clientWidth;
	var height = mainCanvas.clientHeight;
	if (mainCanvas.width != width || mainCanvas.height != height)
	{
		mainCanvas.width  = width;
		mainCanvas.height = height;
		gl.viewportWidth = width;
		gl.viewportHeight = height;
		gl.viewport(0, 0, width, height);
		mat4.perspective(matProjection, 45, width / height, 0.1, 1000.0);
		scene_draw();
	}
	requestAnimationFrame(tick);
}

function scene_init(canvasId)
{
	var canvas = document.getElementById(canvasId);
	scene_initGL(canvas);
	scene_initShaders();
	scene_initGeometry();
	orbitCam  = new_orbitCam(canvas, scene_draw);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}

