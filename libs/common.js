"use strict";

vec3.fromAverage = function(v1, v2)
{
	return vec3.fromValues(
		(v1[0] + v2[0]) / 2,
		(v1[1] + v2[1]) / 2,
		(v1[2] + v2[2]) / 2
	);
}

vec3.toArray = function(v)
{
	return [v[0], v[1], v[2]];	
}

vec3.setLength =function(v1, v2, s)
{
	vec3.normalize(v1, v2);
	vec3.scale(v1, v1, s);
}

vec3.setLength2d =function(v1, v2, s, ignoredAxis)
{
	if (ignoredAxis < 0 || ignoredAxis > 2)
	{
		vec3.set(v1, v2);
		return;
	}
	var toScale = vec2.create();
	if (ignoredAxis == 0) { vec2.set(toScale, v2[1], v2[2]); }
	if (ignoredAxis == 1) { vec2.set(toScale, v2[0], v2[2]); }
	if (ignoredAxis == 2) { vec2.set(toScale, v2[0], v2[1]); }
	vec2.normalize(toScale, toScale);
	vec2.scale(toScale, toScale, s);
	if (ignoredAxis == 0) { vec3.set(v1, v2[0], toScale[0], toScale[1]); }
	if (ignoredAxis == 1) { vec3.set(v1, toScale[0], v2[1], toScale[1]); }
	if (ignoredAxis == 2) { vec3.set(v1, toScale[0], toScale[1], v2[2]); }
}

