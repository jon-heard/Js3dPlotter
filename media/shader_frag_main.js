var shader_frag_main = `

precision mediump float;

varying vec4 passColor;

void main(void)
{
	gl_FragColor = passColor;
}

`

