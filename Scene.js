"use strict";

function new_Scene(canvasId, editorId, statusbarId)
{
	var canvas = document.getElementById(canvasId);
	var editor = document.getElementById(editorId);
	var statusbar = document.getElementById(statusbarId);
	var gl;
	var orbitCam;

	var matProjection = mat4.create();
	var matModelView = mat4.create();

	var state1;
	var state2;
	var currentState;

	try
	{
		gl = canvas.getContext("experimental-webgl");
	}
	catch (e) {}
	if (!gl)
	{
		alert("Unable to initialise WebGL");
		return;
	}

	gl.enable(gl.DEPTH_TEST);
	//gl.enable(gl.CULL_FACE);
	//gl.cullFace(gl.BACK);

	orbitCam = new_OrbitCam(canvas);
	state1 = new_SceneState(gl);
	state2 = new_SceneState(gl);
	currentState = state1;

	editor.onkeyup = function()
	{
		try
		{
			var backState = currentState==state1 ? state2 : state1;
			backState.clear();
			(new Function(
				"vertex",
				"v",
				"color",
				"c",
				"'use strict'; " + editor.value))(
				backState.vertex,
				backState.vertex,
				backState.color,
				backState.color
			);
			statusbar.innerHTML = "Script OK";
			statusbar.style.backgroundColor = "gray";
			if (!backState.equals(currentState))
			{
				currentState = backState;
			}
		}
		catch (e)
		{
			statusbar.innerHTML = e.message;
			statusbar.style.backgroundColor = "red";
		}
	}
	editor.onkeyup();

	function tick()
	{
		var width  = canvas.clientWidth;
		var height = canvas.clientHeight;
		var canvasChanged = (canvas.width != width || canvas.height != height);
		if (canvasChanged)
		{
			canvas.width = width;
			canvas.height = height;
			gl.viewportWidth = width;
			gl.viewportHeight = height;
			gl.viewport(0, 0, width, height);
			mat4.perspective(matProjection, 45, width / height, 0.1, 1000.0);
		}
		if (canvasChanged || orbitCam.getIsChanged() || currentState.getIsChanged())
		{
			orbitCam.setIsChanged(false);
			var clearColor = currentState.getBackgroundColor();
			gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			mat4.copy(matModelView, orbitCam.getView());
			currentState.render(matProjection, matModelView);
		}
		requestAnimationFrame(tick);
	}

	tick();
}

