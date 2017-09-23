"use strict";

function new_OrbitCam(canvas, repaint)
{
	var mouseSensitivity = .1;
	var zoomSpeed = .5;

	var view = mat4.create();
	var rotation = quat.create();
	var position = vec3.fromValues(0.0, 0.0, -10.0);

	var previousMouse = vec3.create();
	var previousRotation = quat.create();

	canvas.onmousedown = function(event)
	{
		if (event.buttons == 1)
		{
			vec3.set(previousMouse, event.clientY, event.clientX, 0);
			quat.copy(previousRotation, rotation);
		}
	};

	var mouseDelta = vec3.create();
	canvas.onmousemove = function(event)
	{
		if (event.buttons == 1)
		{
			vec3.sub(mouseDelta, vec3.fromValues(event.clientY, event.clientX, 0), previousMouse);
			vec2.normalize(mouseDelta, mouseDelta);
			if (vec2.len(mouseDelta) > 0)
			{
				quat.setAxisAngle(rotation, mouseDelta, vec2.len(mouseDelta) * mouseSensitivity);
				quat.mul(rotation, rotation, previousRotation);
				canvas.onmousedown(event);
				repaint();
			}
		}
	};

	canvas.onwheel = function(event)
	{
		position[2] -= (event.deltaX + event.deltaY) * zoomSpeed;
		if (position[2] > -1)
		{
			position[2] = -1;
		}
		repaint();
	};

	function getView()
	{
		mat4.fromRotationTranslation(view, rotation, position);
		return view;
	}

	function getMouseSensitivity() { return mouseSensitivity; }
	function setMouseSensitivity(value) { mouseSensitivity = value; }
	function getZoomSpeed() { return zoomSpeed; }
	function setZoomSpeed(value) { zoomSpeed = value; }
	function getViewDistance() { return position[2] * -1; }
	function setViewDistance(value) { position[2] = value * -1; }

	return {
		getView: getView,
		getMouseSensitivity: getMouseSensitivity,
		setMouseSensitivity: setMouseSensitivity,
		getZoomSpeed: getZoomSpeed,
		setZoomSpeed: setZoomSpeed,
		getViewDistance: getViewDistance,
		setViewDistance: setViewDistance
	};
}

