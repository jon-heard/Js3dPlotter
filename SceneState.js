"use strict";

function new_SceneState()
{
	var vertices = [];
	var colors = [];
	var normals = [];

	var vertexBuffer = 0;
	var colorBuffer = 0;
	var normalBuffer = 0;

	var backgroundColor = [0.0, 0.0, 0.0, 1.0];
	var currentColor = [1.0, 1.0, 1.0, 1.0];
	var isChanged = false;

	var renderer = new_Renderer();
	var primitiveRenderer = new_PrimitiveRenderer(renderer);
	var currentRenderFunction = renderer.render_vertColored_viewLit;

	function refreshGeometry()
	{
		if (vertexBuffer == 0) { vertexBuffer = gl.createBuffer(); }
		if (colorBuffer == 0) { colorBuffer = gl.createBuffer(); }
		if (normalBuffer == 0) { normalBuffer = gl.createBuffer(); }

		var vertexCount = normals.length / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		vertexBuffer.itemSize = 3;
		vertexBuffer.numItems = vertexCount;

		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		colorBuffer.itemSize = 4;
		colorBuffer.numItems = vertexCount;

		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		normalBuffer.itemSize = 3;
		normalBuffer.numItems = vertexCount;

		isChanged = false;
	}

	function render(matProjection, matModelView)
	{
		if (isChanged) { refreshGeometry(); }
		currentRenderFunction(matProjection, matModelView, vertexBuffer, colorBuffer, normalBuffer);
		for (var i = 0; i < vertices.length; i += 3)
		{
			var vertex = vec3.fromArray(vertices, i);
			primitiveRenderer.renderPoint(matProjection, matModelView, vertex, 0.1, [1,1,1,1]);
		}
	}

	function clear()
	{
		vertices = [];
		colors = [];
		normals = [];
		isChanged = true;
	}

	function getBackgroundColor() { return backgroundColor; }
	function setBackgroundColor(red, green, blue, alpha)
	{
		backgroundColor[0] = (red === undefined ? 1.0 : red);
		backgroundColor[1] = (green === undefined ? 1.0 : green);
		backgroundColor[2] = (blue === undefined ? 1.0 : blue);
		backgroundColor[3] = (alpha === undefined ? 1.0 : alpha);
	}

	function vertex(x, y, z)
	{
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		colors.push(currentColor[0]);
		colors.push(currentColor[1]);
		colors.push(currentColor[2]);
		colors.push(currentColor[3]);
		if (vertices.length % 9 == 0) // if new triangle, add normals
		{
			var i = vertices.length - 1;
			var v1 = vec3.fromArray(vertices, i-8);
			var v2 = vec3.fromArray(vertices, i-5);
			var v3 = vec3.fromArray(vertices, i-2);
			var normal = vec3.create();
			vec3.calculateNormal(normal, v1, v2, v3);
			vec3.push(normals, normal);
			vec3.push(normals, normal);
			vec3.push(normals, normal);
		}

		isChanged = true;
	}

	function color(red, green, blue, alpha)
	{
		currentColor[0] = (red === undefined ? 1.0 : red);
		currentColor[1] = (green === undefined ? 1.0 : green);
		currentColor[2] = (blue === undefined ? 1.0 : blue);
		currentColor[3] = (alpha === undefined ? 1.0 : alpha);
	}

	return {
		render: render,
		clear: clear,
		getBackgroundColor: getBackgroundColor,
		setBackgroundColor: setBackgroundColor,
		vertex: vertex,
		color: color
	};
}
