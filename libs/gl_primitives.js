"use strict";

function new_primitiveRenderer(canvas)
{
	var resolution 3;
	var pointBuffer = 0;
	var lineBuffer = 0;

	function refreshGeometry()
	{
		if (pointBuffer != 0)
		{
			gl.deleteBuffer(pointBuffer);
		}
		if (lineBuffer != 0)
		{
			gl.deleteBuffer(lineBuffer);
		}
		pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, makePointVertices(), gl.STATIC_DRAW);
		pointBuffer.itemSize = 3;
		pointBuffer.numItems = 36;

		lineBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, makeLineVertices(), gl.STATIC_DRAW);
		pointBuffer.itemSize = 3;
		pointBuffer.numItems = 36;
	}

	function makePointVertices()
	{
		var hSize = size;
		var result =
		[
			// back
			-hSize, -hSize, -hSize,	-hSize, +hSize, -hSize,	+hSize, +hSize, -hSize,
			-hSize, -hSize, -hSize,	+hSize, +hSize, -hSize,	+hSize, -hSize, -hSize,
			// front
			-hSize, -hSize, +hSize,	+hSize, +hSize, +hSize,	-hSize, +hSize, +hSize,
			-hSize, -hSize, +hSize,	+hSize, -hSize, +hSize,	+hSize, +hSize, +hSize,
			// left
			-hSize, -hSize, -hSize,	-hSize, +hSize, +hSize,	-hSize, +hSize, -hSize,
			-hSize, -hSize, -hSize,	-hSize, -hSize, +hSize,	-hSize, +hSize, +hSize,
			// right
			+hSize, -hSize, -hSize,	+hSize, +hSize, -hSize,	+hSize, +hSize, +hSize,
			+hSize, -hSize, -hSize,	+hSize, +hSize, +hSize,	+hSize, -hSize, +hSize,
			// top
			-hSize, +hSize, -hSize,	+hSize, +hSize, +hSize,	+hSize, +hSize, -hSize,
			-hSize, +hSize, -hSize,	-hSize, +hSize, +hSize,	+hSize, +hSize, +hSize,
			// bottom
			-hSize, -hSize, -hSize,	+hSize, -hSize, +hSize,	-hSize, -hSize, +hSize,
			-hSize, -hSize, -hSize,	+hSize, -hSize, -hSize,	+hSize, -hSize, +hSize
		];
		return new Float32Array(result);
	}

	function makeLineVertices()
	{
		var line =
		[
			// back
			-hSize, -hSize, -hSize,	-hSize, +hSize, -hSize,	+hSize, +hSize, -hSize,
			-hSize, -hSize, -hSize,	+hSize, +hSize, -hSize,	+hSize, -hSize, -hSize,
			// front
			-hSize, -hSize, +hSize,	+hSize, +hSize, +hSize,	-hSize, +hSize, +hSize,
			-hSize, -hSize, +hSize,	+hSize, -hSize, +hSize,	+hSize, +hSize, +hSize,
			// left
			-hSize, -hSize, -hSize,	-hSize, +hSize, +hSize,	-hSize, +hSize, -hSize,
			-hSize, -hSize, -hSize,	-hSize, -hSize, +hSize,	-hSize, +hSize, +hSize,
			// right
			+hSize, -hSize, -hSize,	+hSize, +hSize, -hSize,	+hSize, +hSize, +hSize,
			+hSize, -hSize, -hSize,	+hSize, +hSize, +hSize,	+hSize, -hSize, +hSize,
			// top
			-hSize, +hSize, -hSize,	+hSize, +hSize, +hSize,	+hSize, +hSize, -hSize,
			-hSize, +hSize, -hSize,	-hSize, +hSize, +hSize,	+hSize, +hSize, +hSize,
			// bottom
			-hSize, -hSize, -hSize,	+hSize, -hSize, +hSize,	-hSize, -hSize, +hSize,
			-hSize, -hSize, -hSize,	+hSize, -hSize, -hSize,	+hSize, -hSize, +hSize
		];
		return new Float32Array(result);
	}

	function renderPoint(position, size, color)
	{
		
	}

	function renderline(position1, position2, size, color)
	{
	}

	function getResolution() { return resolution; }
	function setResolution(value)
	{
		if (resolution != value)
		{
			resolution = value;
			refreshGeometry();
		}
	}

	refreshGeometry();

	return {
		renderPoint: renderPoint,
		renderLine: renderLine,
		getResolution: getResolution,
		setResolution: setResolution,
	};
}

