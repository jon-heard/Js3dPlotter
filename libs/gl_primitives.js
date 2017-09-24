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
		if (pointBuffer != 0)
		{
			gl.deleteBuffer(pointBuffer);
			gl.deleteBuffer(pointNormalBuffer);
		}
		if (lineBuffer != 0)
		{
			gl.deleteBuffer(lineBuffer);
			gl.deleteBuffer(lineNormalBuffer);
		}

		var pointData = makePointData();		
		var lineData = makeLineData();		

		pointBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointData.positionData), gl.STATIC_DRAW);
		pointBuffer.itemSize = 3;
		pointBuffer.numItems = pointData.vertexCount;

		pointNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, pointNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointData.normalData), gl.STATIC_DRAW);
		pointNormalBuffer.itemSize = 3;
		pointNormalBuffer.numItems = pointData.vertexCount;

		lineBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineData.positionData), gl.STATIC_DRAW);
		lineBuffer.itemSize = 3;
		lineBuffer.numItems = lineData.vertexCount;

		lineNormalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, lineNormalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineData.normalData), gl.STATIC_DRAW);
		lineNormalBuffer.itemSize = 3;
		lineNormalBuffer.numItems = lineData.vertexCount;
	}

	function calculateNormalData(positionData)
	{
		var result = [];
		for (var i = 0; i < positionData.length; i += 9)
		{
			var v1 = vec3.fromValues(positionData[i+0], positionData[i+1], positionData[i+2]);
			var v2 = vec3.fromValues(positionData[i+3], positionData[i+4], positionData[i+5]);
			var v3 = vec3.fromValues(positionData[i+6], positionData[i+7], positionData[i+8]);
			var normalCalc1 = vec3.create();
			var normalCalc2 = vec3.create();
			vec3.sub(normalCalc1, v1, v2);
			vec3.sub(normalCalc2, v1, v3);
			vec3.normalize(normalCalc1, normalCalc1);
			vec3.normalize(normalCalc2, normalCalc2);
			var normal = vec3.create();
			vec3.cross(normal, normalCalc1, normalCalc2);
			vec3.normalize(normal, normal);
			normal = vec3.toArray(normal);
			result.push(...normal);
			result.push(...normal);
			result.push(...normal);
		}
		return result;
	}

	function makeUnitCubeData()
	{
		var positionData =
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
			positionData: positionData,
			normalData: calculateNormalData(positionData)
		};
	}
	function makePointData()
	{
		var cubeData = makeUnitCubeData();
		var srcData = cubeData.positionData;

		// Normalize cube data to .5 radius
		var v = vec3.fromValues(.5,.5,.5);
		vec3.setLength(v, v, 0.5);
		v = v[0];
		for (var i = 0; i < srcData.length; ++i)
		{
			srcData[i] = srcData[i] > 0 ? v : -v;
		}
		var positionData = srcData;

		// Subdivide "resolution" times
		for (var i = 0; i < resolution-1; ++i)
		{
			positionData = [];
			for (var j = 0; j < srcData.length; j += 9)
			{
				var v1 = vec3.fromValues(srcData[j+0], srcData[j+1], srcData[j+2]);
				var v2 = vec3.fromValues(srcData[j+3], srcData[j+4], srcData[j+5]);
				var v3 = vec3.fromValues(srcData[j+6], srcData[j+7], srcData[j+8]);
				var avg1 = vec3.fromAverage(v1, v2);
				vec3.setLength(avg1, avg1, 0.5);
				var avg2 = vec3.fromAverage(v2, v3);
				vec3.setLength(avg2, avg2, 0.5);
				var avg3 = vec3.fromAverage(v3, v1);
				vec3.setLength(avg3, avg3, 0.5);

				positionData.push(...vec3.toArray(avg1));
				positionData.push(...vec3.toArray(avg2));
				positionData.push(...vec3.toArray(avg3));

				positionData.push(...vec3.toArray(avg1));
				positionData.push(...vec3.toArray(avg3));
				positionData.push(...vec3.toArray(v1));

				positionData.push(...vec3.toArray(avg1));
				positionData.push(...vec3.toArray(v2));
				positionData.push(...vec3.toArray(avg2));

				positionData.push(...vec3.toArray(avg2));
				positionData.push(...vec3.toArray(v3));
				positionData.push(...vec3.toArray(avg3));
			}
			srcData = positionData;
		}

		return {
			vertexCount: positionData.length / 3,
			positionData: positionData,
			normalData: calculateNormalData(positionData)
		};
	}

	function makeLineData()
	{
		var cubeData = makeUnitCubeData();
		var srcData = cubeData.positionData;

		// Remove caps, if doing subdividing (need to remake them differently)
		if (resolution > 1)
		{
			srcData.splice(0, 36);
		}

		// Normalize cube data to .5 radius (ignoring y axis)
		var v = vec3.fromValues(.5,0,.5);
		vec3.setLength(v, v, 0.5);
		v = v[0];
		for (var i = 0; i < srcData.length; i += 3)
		{
			srcData[i] = srcData[i] > 0 ? v : -v;
			srcData[i+2] = srcData[i+2] > 0 ? v : -v;
		}
		var positionData = srcData;

		// Subdivide "resolution" times
		for (var i = 0; i < resolution-1; ++i)
		{
			positionData = [];
			for (var j = 0; j < srcData.length; j += 9)
			{
				var v1 = vec3.fromValues(srcData[j+0], srcData[j+1], srcData[j+2]);
				var v2 = vec3.fromValues(srcData[j+3], srcData[j+4], srcData[j+5]);
				var v3 = vec3.fromValues(srcData[j+6], srcData[j+7], srcData[j+8]);

				var mid = vec3.fromAverage(v1, v2); 
				vec3.setLength2d(mid, mid, 0.5, 1);

				var n1 = vec3.clone(v1);
				var n2 = vec3.clone(mid);
				var n3 = vec3.clone(v3);

				var n4 = vec3.clone(mid);
				var n5 = vec3.clone(v2);
				var n6 = vec3.clone(mid);
				n6[1] *= -1;

				positionData.push(...vec3.toArray(n1));
				positionData.push(...vec3.toArray(n2));
				positionData.push(...vec3.toArray(n3));

				positionData.push(...vec3.toArray(n4));
				positionData.push(...vec3.toArray(n5));
				positionData.push(...vec3.toArray(n6));
			}
			srcData = positionData;
		}

		// Re-add caps, if subdividing
		if (resolution > 1)
		{
			var pointCount = 4 * Math.pow(2, resolution-1);
			var topCenter = [0.0, 0.5, 0.0];
			var bottomCenter = [0.0, -0.5, 0.0];
			var previousTopPoint = [Math.sin(0)/2, 0.5, Math.cos(0)/2];
			var previousBottomPoint = [Math.sin(0)/2, -0.5, Math.cos(0)/2];
			for (var i = 1; i <= pointCount; ++i)
			{
				var pointAngle = i / pointCount * Math.PI * 2;
				var topPoint = [Math.sin(pointAngle)/2, 0.5, Math.cos(pointAngle)/2];
				var bottomPoint = [Math.sin(-pointAngle)/2, -0.5, Math.cos(-pointAngle)/2];

				positionData.push(...previousTopPoint);
				positionData.push(...topPoint);
				positionData.push(...topCenter);

				positionData.push(...previousBottomPoint);
				positionData.push(...bottomPoint);
				positionData.push(...bottomCenter);

				previousTopPoint = topPoint;
				previousBottomPoint = bottomPoint;
			}
		}

		return {
			vertexCount: positionData.length / 3,
			positionData: positionData,
			normalData: calculateNormalData(positionData)
		};
	}

	function renderPoint(matProjection, matModelView, position, size, color)
	{
		var transform = mat4.clone(matModelView);
		mat4.scale(transform, transform, vec3.fromValues(size, size, size));
		mat4.translate(transform, transform, position);
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

