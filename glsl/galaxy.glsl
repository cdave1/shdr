#version 330

uniform vec3      iResolution;           // viewport resolution (in pixels)
//uniform float     iChannelTime[4];       // channel playback time (in seconds)
//uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
//uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
//uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
//uniform vec4      iDate;                 // (year, month, day, time in seconds)

uniform float iGlobalTime;
uniform sampler2D iTexture0;
uniform vec4      iMouse;

//in vec2 textureCoord;
//in vec4 colorVarying;

float field(in vec3 p) {
	float strength = 7. + .03 * log(1.e-6 + fract(sin(iGlobalTime) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 32; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - .7);
}

void main() {
    vec2 loc = vec2(1000.0 * texture_coordinate[0], 1000.0 * texture_coordinate[1] - 500.); //vec2(100. * iGlobalTime + gl_FragCoord.x, gl_FragCoord.y - 100. *iGlobalTime);
	vec2 uv = 2. * loc.xy / iResolution.xy - 1.;
	vec2 uvs = uv * iResolution.xy / max(iResolution.x, iResolution.y);
	vec3 p = vec3(uvs / 4., 0) + vec3(1., -1.3, 0.);
	//p += .2 * vec3(sin(iGlobalTime / 16.), sin(iGlobalTime / 12.),  sin(iGlobalTime / 128.));
    
    float speed = 0.01;
    p += .2 * vec3(sin(iGlobalTime * speed / 16.), sin(iGlobalTime * speed / 12.),  sin(iGlobalTime * speed / 128.));
    float t = field(p);
	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
    
    vec4 color = mix(.4, 1., v) * vec4(1.8 * t * t * t, 1.4 * t * t, t, 1.0);
    
	gl_fragColor = color; // * (gl_ProjectionMatrix * gl_ModelViewMatrix);
}