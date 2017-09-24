"use strict";

vec3.average = function(destVec, srcVec1, srcVec2)
{
	vec3.set(destVec,
		(srcVec1[0] + srcVec2[0]) / 2,
		(srcVec1[1] + srcVec2[1]) / 2,
		(srcVec1[2] + srcVec2[2]) / 2
	);
}

vec3.push = function(destArray, srcVec)
{
	destArray.push(srcVec[0]);
	destArray.push(srcVec[1]);
	destArray.push(srcVec[2]);
}

vec3.setLength = function(destVec, srcVec, length)
{
	vec3.normalize(destVec, srcVec);
	vec3.scale(destVec, destVec, length);
}

vec3.setLength2d = function(destVec, srcVec, length, ignoredAxis)
{
	if (ignoredAxis < 0 || ignoredAxis > 2)
	{
		vec3.set(destVec, srcVec);
		return;
	}
	var toScale = vec2.create();
	if (ignoredAxis == 0) { vec2.set(toScale, srcVec[1], srcVec[2]); }
	if (ignoredAxis == 1) { vec2.set(toScale, srcVec[0], srcVec[2]); }
	if (ignoredAxis == 2) { vec2.set(toScale, srcVec[0], srcVec[1]); }
	vec2.normalize(toScale, toScale);
	vec2.scale(toScale, toScale, length);
	if (ignoredAxis == 0) { vec3.set(destVec, srcVec[0], toScale[0], toScale[1]); }
	if (ignoredAxis == 1) { vec3.set(destVec, toScale[0], srcVec[1], toScale[1]); }
	if (ignoredAxis == 2) { vec3.set(destVec, toScale[0], toScale[1], srcVec[2]); }
}

vec3.calculateNormal = function(destVec, vertex1, vertex2, vertex3)
{
	var normalCalc1 = vec3.create();
	var normalCalc2 = vec3.create();
	vec3.sub(normalCalc1, vertex1, vertex2);
	vec3.sub(normalCalc2, vertex1, vertex3);
	vec3.normalize(normalCalc1, normalCalc1);
	vec3.normalize(normalCalc2, normalCalc2);
	vec3.cross(destVec, normalCalc1, normalCalc2);
	vec3.normalize(destVec, destVec);
}

vec3.fromArray = function(srcArray, startIndex)
{
	return vec3.fromValues(
		srcArray[startIndex+0],
		srcArray[startIndex+1],
		srcArray[startIndex+2]);
}

