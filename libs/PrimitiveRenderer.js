"use strict";

function new_PrimitiveRenderer(renderer)
{
	var resolution = 4;

	var pointBuffer = 0;
	var pointNormalBuffer = 0;
	var lineBuffer = 0;
	var lineNormalBuffer = 0;

	function refreshGeometry()
	{
		if (pointBuffer == 0) { pointBuffer = gl.createBuffer(); }
		if (pointNormalBuffer == 0) { pointNormalBuffer = gl.createBuffer(); }
		if (lineBuffer == 0) { lineBuffer = gl.createBuffer(); }
		if (lineNormalBuffer == 0) { lineNormalBuffer = gl.createBuffer(); }

		var pointGeometry = makePointGeometry();
		var lineGeometry = makeLineGeometry();

		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointGeometry.vertices), gl.STATIC_DRAW);
		pointBuffer.itemSize = 3;
		pointBuffer.numItems = pointGeometry.vertexCount;

		pointNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointGeometry.normals), gl.STATIC_DRAW);
		pointNormalBuffer.itemSize = 3;
		pointNormalBuffer.numItems = pointGeometry.vertexCount;

		lineBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineGeometry.vertices), gl.STATIC_DRAW);
		lineBuffer.itemSize = 3;
		lineBuffer.numItems = lineGeometry.vertexCount;

		lineNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineGeometry.normals), gl.STATIC_DRAW);
		lineNormalBuffer.itemSize = 3;
		lineNormalBuffer.numItems = lineGeometry.vertexCount;
	}

	function calculateNormals(vertices)
	{
		var result = [];
		for (var i = 0; i < vertices.length; i += 9)
		{
			var v1 = vec3.fromArray(vertices, i+0);
			var v2 = vec3.fromArray(vertices, i+3);
			var v3 = vec3.fromArray(vertices, i+6);
			var normal = vec3.create();
			vec3.calculateNormal(normal, v1, v2, v3);
			vec3.push(result, normal);
			vec3.push(result, normal);
			vec3.push(result, normal);
		}
		return result;
	}

	function makeCubeGeometry()
	{
		var vertices =
		[
			// top
			-0.5, +0.5, -0.5,	+0.5, +0.5, +0.5,	+0.5, +0.5, -0.5,
			-0.5, +0.5, -0.5,	-0.5, +0.5, +0.5,	+0.5, +0.5, +0.5,
			// bottom
			-0.5, -0.5, -0.5,	+0.5, -0.5, +0.5,	-0.5, -0.5, +0.5,
			-0.5, -0.5, -0.5,	+0.5, -0.5, -0.5,	+0.5, -0.5, +0.5,
			// back
			-0.5, +0.5, -0.5,	+0.5, +0.5, -0.5,	-0.5, -0.5, -0.5,
			+0.5, -0.5, -0.5,	-0.5, -0.5, -0.5,	+0.5, +0.5, -0.5,
			// front
			+0.5, +0.5, +0.5,	-0.5, +0.5, +0.5,	+0.5, -0.5, +0.5,
			-0.5, -0.5, +0.5,	+0.5, -0.5, +0.5,	-0.5, +0.5, +0.5,
			// left
			-0.5, +0.5, +0.5,	-0.5, +0.5, -0.5,	-0.5, -0.5, +0.5,
			-0.5, -0.5, -0.5,	-0.5, -0.5, +0.5,	-0.5, +0.5, -0.5,
			// right
			+0.5, +0.5, -0.5,	+0.5, +0.5, +0.5,	+0.5, -0.5, -0.5,
			+0.5, -0.5, +0.5,	+0.5, -0.5, -0.5,	+0.5, +0.5, +0.5
		];
		return {
			vertexCount: 36,
			vertices: vertices,
			normals: calculateNormals(vertices)
		};
	}
	function makePointGeometry()
	{
		var srcVertices = makeCubeGeometry().vertices;

		// Scale cube geometry to .5 radius (different from unit cube)
		var scale = vec3.fromValues(0.5, 0.5, 0.5);
		vec3.setLength(scale, scale, 0.5);
		scale = scale[0];
		for (var i = 0; i < srcVertices.length; ++i)
		{
			srcVertices[i] = srcVertices[i] > 0 ? scale : -scale;
		}
		var vertices = srcVertices;

		// Subdivide "resolution" times
		for (var i = 0; i < resolution-1; ++i)
		{
			vertices = [];
			for (var j = 0; j < srcVertices.length; j += 9)
			{
				var v1 = vec3.fromArray(srcVertices, j+0);
				var v2 = vec3.fromArray(srcVertices, j+3);
				var v3 = vec3.fromArray(srcVertices, j+6);
				var avg1 = vec3.create();
				vec3.average(avg1, v1, v2);
				vec3.setLength(avg1, avg1, 0.5);
				var avg2 = vec3.create();
				vec3.average(avg2, v2, v3);
				vec3.setLength(avg2, avg2, 0.5);
				var avg3 = vec3.create();
				vec3.average(avg3, v3, v1);
				vec3.setLength(avg3, avg3, 0.5);

				vec3.push(vertices, avg1);
				vec3.push(vertices, avg2);
				vec3.push(vertices, avg3);

				vec3.push(vertices, avg1);
				vec3.push(vertices, avg3);
				vec3.push(vertices, v1);

				vec3.push(vertices, avg1);
				vec3.push(vertices, v2);
				vec3.push(vertices, avg2);

				vec3.push(vertices, avg2);
				vec3.push(vertices, v3);
				vec3.push(vertices, avg3);
			}
			srcVertices = vertices;
		}

		return {
			vertexCount: vertices.length / 3,
			vertices: vertices,
			normals: calculateNormals(vertices)
		};
	}

	function makeLineGeometry()
	{
		var srcVertices = makeCubeGeometry().vertices;

		// Remove caps, if doing subdividing (need to remake them)
		if (resolution > 1)
		{
			srcVertices.splice(0, 36);
		}

		// Normalize cube data to .5 radius (ignoring y axis)
		var scale = vec3.fromValues(0.5, 0.0, 0.5);
		vec3.setLength(scale, scale, 0.5);
		scale = scale[0];
		for (var i = 0; i < srcVertices.length; i += 3)
		{
			srcVertices[i] = srcVertices[i] > 0 ? scale : -scale;
			srcVertices[i+2] = srcVertices[i+2] > 0 ? scale : -scale;
		}
		var vertices = srcVertices;

		// Subdivide "resolution" times
		for (var i = 0; i < resolution-1; ++i)
		{
			vertices = [];
			for (var j = 0; j < srcVertices.length; j += 9)
			{
				var v1 = vec3.fromArray(srcVertices, j+0);
				var v2 = vec3.fromArray(srcVertices, j+3);
				var v3 = vec3.fromArray(srcVertices, j+6);

				var mid = vec3.create();
				vec3.average(mid, v1, v2); 
				vec3.setLength2d(mid, mid, 0.5, 1);

				vec3.push(vertices, v1);
				vec3.push(vertices, mid);
				vec3.push(vertices, v3);
				vec3.push(vertices, mid);
				vec3.push(vertices, v2);
				vec3.push(vertices, vec3.fromValues(mid[0], -mid[1], mid[2]));
			}
			srcVertices = vertices;
		}

		// Re-add caps, if subdividing
		if (resolution > 1)
		{
			var pointCount = 4 * Math.pow(2, resolution-1);
			var topCenter = vec3.fromValues(0.0, 0.5, 0.0);
			var bottomCenter = vec3.fromValues(0.0, -0.5, 0.0);
			var previousTopPoint = vec3.fromValues(Math.sin(0)/2, 0.5, Math.cos(0)/2);
			var previousBottomPoint = vec3.fromValues(Math.sin(0)/2, -0.5, Math.cos(0)/2);
			for (var i = 1; i <= pointCount; ++i)
			{
				var pointAngle = i / pointCount * Math.PI * 2;
				var topPoint = vec3.fromValues(Math.sin(pointAngle)/2, 0.5, Math.cos(pointAngle)/2);
				var bottomPoint = vec3.fromValues(Math.sin(-pointAngle)/2, -0.5, Math.cos(-pointAngle)/2);
				vec3.push(vertices, previousTopPoint);
				vec3.push(vertices, topPoint);
				vec3.push(vertices, topCenter);
				vec3.push(vertices, previousBottomPoint);
				vec3.push(vertices, bottomPoint);
				vec3.push(vertices, bottomCenter);
				previousTopPoint = topPoint;
				previousBottomPoint = bottomPoint;
			}
		}

		return {
			vertexCount: vertices.length / 3,
			vertices: vertices,
			normals: calculateNormals(vertices)
		};
	}

	function renderPoint(matProjection, matModelView, position, size, color)
	{
		var transform = mat4.clone(matModelView);
		mat4.translate(transform, transform, position);
		mat4.scale(transform, transform, vec3.fromValues(size, size, size));
		renderer.render_oneColored_viewLit(matProjection, transform, pointBuffer, color, pointNormalBuffer);
	}

	function renderLine(matProjection, matModelView, position1, position2, size, color)
	{
		var transform = mat4.clone(matModelView);
		mat4.scale(transform, transform, vec3.fromValues(size, size, size));
		mat4.translate(transform, transform, position1);
		renderer.render_oneColored_viewLit(matProjection, transform, lineBuffer, color, lineNormalBuffer);
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

