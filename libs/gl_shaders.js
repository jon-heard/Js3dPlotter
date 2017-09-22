function gl_buildShader(source, type)
{
	var result;
	result = gl.createShader(type);
	gl.shaderSource(result, source);
	gl.compileShader(result);
	if (!gl.getShaderParameter(result, gl.COMPILE_STATUS))
	{
		var msg = "Invalid " + (type==gl.VERTEX_SHADER?"vertex":"fragment") + " shader:\n";
		alert(msg + gl.getShaderInfoLog(result));
		return null;
	}
	return result;
}

function gl_buildShaderProgram(vertSource, fragSource)
{
	var vertexShader = gl_buildShader(vertSource, gl.VERTEX_SHADER);
	var fragmentShader = gl_buildShader(fragSource, gl.FRAGMENT_SHADER);

	var result = gl.createProgram();
	gl.attachShader(result, vertexShader);
	gl.attachShader(result, fragmentShader);
	gl.linkProgram(result);
	if (!gl.getProgramParameter(result, gl.LINK_STATUS))
	{
		alert("Unable to build shader program");
		return null;
	}
	return result;
}

