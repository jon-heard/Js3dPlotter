var shader_frag_main = `

precision mediump float;

varying vec4 passColor;
varying float fakeLight;

void main(void)
{
	gl_FragColor = vec4(passColor.rgb * fakeLight, passColor.a);
}

`

