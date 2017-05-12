#version 330

uniform vec2 iResolution;
uniform float iGlobalTime;
varying vec2 fragCoord;

void main() {
    vec2 uv = fragCoord.xy / iResolution.xy;
    gl_fragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);
}
