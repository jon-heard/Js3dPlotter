"use strict";

function new_Renderer()
{
	var shader_vertColored_flat;
	var shader_vertColored_viewLit;
	var shader_vertColored_topLit;
	var shader_vertColored_topBottomLit;
	var shader_oneColored_flat;
	var shader_oneColored_viewLit;
	var shader_oneColored_topLit;
	var shader_oneColored_topBottomLit;

	function render_generic (projection, modelView, positions, shader)
	{
		gl.uniformMatrix4fv(shader.uniProjection, false, projection);
		gl.uniformMatrix4fv(shader.uniModelView, false, modelView);
		gl.enableVertexAttribArray(shader.atrPosition);
		gl.bindBuffer(gl.ARRAY_BUFFER, positions);
		gl.vertexAttribPointer(shader.atrPosition, positions.itemSize, gl.FLOAT, false, 0, 0);
	}
	function render_vertColored_flat (projection, modelView, positions, colors)
	{
		var shader = shader_vertColored_flat;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.enableVertexAttribArray(shader.atrColor);
		gl.bindBuffer(gl.ARRAY_BUFFER, colors);
		gl.vertexAttribPointer(shader.atrColor, colors.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_vertColored_viewLit (projection, modelView, positions, colors, normals)
	{
		var shader = shader_vertColored_viewLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.enableVertexAttribArray(shader.atrColor);
		gl.bindBuffer(gl.ARRAY_BUFFER, colors);
		gl.vertexAttribPointer(shader.atrColor, colors.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_vertColored_topLit (projection, modelView, positions, colors, normals)
	{
		var shader = shader_vertColored_topLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.enableVertexAttribArray(shader.atrColor);
		gl.bindBuffer(gl.ARRAY_BUFFER, colors);
		gl.vertexAttribPointer(shader.atrColor, colors.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_vertColored_topBottomLit (projection, modelView, positions, colors, normals)
	{
		var shader = shader_vertColored_topBottomLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.enableVertexAttribArray(shader.atrColor);
		gl.bindBuffer(gl.ARRAY_BUFFER, colors);
		gl.vertexAttribPointer(shader.atrColor, colors.itemSize, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_oneColored_flat (projection, modelView, positions, color)
	{
		var shader = shader_oneColored_flat;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.uniform4fv(shader.uniColor, color);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_oneColored_viewLit (projection, modelView, positions, color, normals)
	{
		var shader = shader_oneColored_viewLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.uniform4fv(shader.uniColor, color);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_oneColored_topLit (projection, modelView, positions, color, normals)
	{
		var shader = shader_oneColored_topLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.uniform4fv(shader.uniColor, color);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function render_oneColored_topBottomLit (projection, modelView, positions, color, normals)
	{
		var shader = shader_oneColored_topBottomLit;
		gl.useProgram(shader);
		render_generic(projection, modelView, positions, shader);
		gl.uniform4fv(shader.uniColor, color);
		gl.enableVertexAttribArray(shader.atrNormal);
		gl.bindBuffer(gl.ARRAY_BUFFER, normals);
		gl.vertexAttribPointer(shader.atrNormal, normals.itemSize, gl.FLOAT, false, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, positions.numItems);
	}

	function makeVertShaderSource(isVertexColored, isLit, lightDirection, isDoubleLightDirection)
	{
		var result = "attribute vec3 atrPosition;\n"

		if (isLit)
		{
			result += "attribute vec3 atrNormal;\n";
		}

		if (isVertexColored)
		{
			result += "attribute vec4 atrColor;\n";
		}
		else
		{
			result += "uniform vec4 uniColor;\n";
		}

		result += "uniform mat4 uniProjection;\n";
		result += "uniform mat4 uniModelView;\n";
		result += "varying vec4 varColor;\n";
		result += "varying float varLight;\n";
		result += "void main() {\n";
		result += "\tgl_Position = uniProjection * uniModelView * vec4(atrPosition, 1.0);\n";
		result += "\tvarColor = ";
		result += (isVertexColored ? "atrColor" : "uniColor");
		result += ";\n";

		if (isLit)
		{
			result += "\tvarLight = clamp(";
			result += (isDoubleLightDirection ? "abs(" : "");
			result += "dot(vec3(";
			result += lightDirection[0] + "," + lightDirection[1] + "," + lightDirection[2];
			result += "), normalize(vec3(uniModelView * vec4(atrNormal, 0.0))))"
			result += (isDoubleLightDirection ? ")" : "");
			result += ", 0.0, 1.0);\n";
		}
		else
		{
			result += "\tvarLight = 1.0;\n";
		}

		result += "}\n\n";
		return result;
	}

	function makeFragShaderSource()
	{
		return `
			precision mediump float;
			varying vec4 varColor;
			varying float varLight;
			void main(void) {
				gl_FragColor = vec4(varColor.rgb * varLight, varColor.a);
			}
		`;
	}

	function buildShader(source, type)
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

	function buildShaderProgram(vertSource, fragSource)
	{
		var vertexShader = buildShader(vertSource, gl.VERTEX_SHADER);
		var fragmentShader = buildShader(fragSource, gl.FRAGMENT_SHADER);

		var result = gl.createProgram();
		gl.attachShader(result, vertexShader);
		gl.attachShader(result, fragmentShader);
		gl.linkProgram(result);
		if (!gl.getProgramParameter(result, gl.LINK_STATUS))
		{
			alert("Unable to build shader program");
			return null;
		}
		result.atrPosition = gl.getAttribLocation(result, "atrPosition");
		result.atrNormal = gl.getAttribLocation(result, "atrNormal");
		result.atrColor = gl.getAttribLocation(result, "atrColor");
		result.uniProjection = gl.getUniformLocation(result, "uniProjection");
		result.uniModelView = gl.getUniformLocation(result, "uniModelView");
		result.uniColor = gl.getUniformLocation(result, "uniColor");
		return result;
	}

	function makeShaders()
	{
		var fragSource = makeFragShaderSource();
		var vertSource = "";

		vertSource = makeVertShaderSource(true, false);
		shader_vertColored_flat = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(true, true, [0,0,1], true);
		shader_vertColored_viewLit = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(true, true, [0,1,0], false);
		shader_vertColored_topLit = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(true, true, [0,1,0], true);
		shader_vertColored_topBottomLit = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(false, false);
		shader_oneColored_flat = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(false, true, [0,0,1], true);
		shader_oneColored_viewLit = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(false, true, [0,1,0], false);
		shader_oneColored_topLit = buildShaderProgram(vertSource, fragSource);
		vertSource = makeVertShaderSource(false, true, [0,1,0], true);
		shader_oneColored_topBottomLit = buildShaderProgram(vertSource, fragSource);
	}

	makeShaders();

	return {
		render_vertColored_flat: render_vertColored_flat,
		render_vertColored_viewLit: render_vertColored_viewLit,
		render_vertColored_topLit: render_vertColored_topLit,
		render_vertColored_topBottomLit: render_vertColored_topBottomLit,
		render_oneColored_flat: render_oneColored_flat,
		render_oneColored_viewLit: render_oneColored_viewLit,
		render_oneColored_topLit: render_oneColored_topLit,
		render_oneColored_topBottomLit: render_oneColored_topBottomLit
	};
		
}

