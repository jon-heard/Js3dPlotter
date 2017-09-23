var shader_vert_main = `

attribute vec3 vertPosition;
attribute vec4 vertColor;
attribute vec3 vertNormal;

uniform mat4 matModelView;
uniform mat4 matProjection;

varying vec4 passColor;
varying float fakeLight;

void main(void)
{
	gl_Position = matProjection * matModelView * vec4(vertPosition, 1.0);
	passColor = vertColor;

	fakeLight = clamp(abs(dot(vec3(0,0,1), vec3(vec4(vertNormal, 0.0) * matModelView))), 0.0, 1.0);
}

`

