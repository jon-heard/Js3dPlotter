var shader_vert_main = `

attribute vec3 vertPosition;
attribute vec4 vertColor;

uniform mat4 matModelView;
uniform mat4 matProjection;

varying vec4 passColor;

void main(void)
{
	gl_Position = matProjection * matModelView * vec4(vertPosition, 1.0);
	passColor = vertColor;
}

`

