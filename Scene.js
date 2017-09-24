"use strict";

function new_Scene(canvasId, editorId)
{
	var canvas = document.getElementById(canvasId);
	var editor = document.getElementById(editorId);
	var gl;
	var orbitCam;
	var sceneState;

	var matProjection = mat4.create();
	var matModelView = mat4.create();

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
	sceneState = new_SceneState(gl);

	sceneState.color(1.0, 0.0, 0.0);
	sceneState.vertex(-1.5, 1.0, 0.0);
	sceneState.color(0.0, 1.0, 0.0);
	sceneState.vertex(-2.5, -1.0, 0.0);
	sceneState.color(0.0, 0.0, 1.0);
	sceneState.vertex(0.5, -1.0, 0.0);
	sceneState.color(1.0, 1.0, 0.0);
	sceneState.vertex(2.5, 1.0, 0.0);
	sceneState.color(1.0, 0.0, 1.0);
	sceneState.vertex(1.0, 1.0, 0.0);
	sceneState.color(0.0, 1.0, 1.0);
	sceneState.vertex(2.5, -1.0, 0.0);

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
		if (canvasChanged || orbitCam.getIsChanged())
		{
			orbitCam.setIsChanged(false);
			var clearColor = sceneState.getBackgroundColor();
			gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			mat4.copy(matModelView, orbitCam.getView());
			sceneState.render(matProjection, matModelView);
		}
		requestAnimationFrame(tick);
	}

	tick();
}

