"use strict";

var mainCanvas;
var gl;
var orbitCam;
var renderer;
var primitiveRenderer;
var currentRenderFunction;

var matProjection = mat4.create();
var matModelView = mat4.create();

var triPositionBuffer;
var rectPositionBuffer;
var colorBuffer;
var rectColorBuffer;
var normalBuffer;

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

	rectPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rectPositionBuffer);
	vertices =
	[
		1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		1.0, -1.0,  0.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	rectPositionBuffer.itemSize = 3;
	rectPositionBuffer.numItems = 3;

	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	var colors =
	[
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	colorBuffer.itemSize = 4;
	colorBuffer.numItems = 3;


	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	var normals =
	[
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	normalBuffer.itemSize = 3;
	normalBuffer.numItems = 3;
}

var rot = 0;

function scene_draw()
{
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.copy(matModelView, orbitCam.getView());

	primitiveRenderer.renderPoint(matProjection, matModelView, vec3.fromValues(0,1.5,0), 1.0, [1,1,0,1]);
	primitiveRenderer.renderLine(matProjection, matModelView, vec3.fromValues(0,-1.5,0), vec3.fromValues(0,0,0), 1.0, [1,0,1,1]);

	mat4.translate(matModelView, matModelView, [-1.5, 0.0, 0.0]);
	currentRenderFunction(matProjection, matModelView, triPositionBuffer, colorBuffer, normalBuffer);

	mat4.translate(matModelView, matModelView, [3.0, 0.0, 0.0]);
	currentRenderFunction(matProjection, matModelView, rectPositionBuffer, colorBuffer, normalBuffer);
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
	scene_initGeometry();
	orbitCam = new_OrbitCam(canvas, scene_draw);
	renderer = new_Renderer();
	primitiveRenderer = new_PrimitiveRenderer(renderer);
	currentRenderFunction = renderer.render_vertColored_viewLit;

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	//gl.enable(gl.CULL_FACE);
	//gl.cullFace(gl.BACK);

	tick();
}

