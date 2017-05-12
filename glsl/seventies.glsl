#version 330

uniform vec3 iResolution;
uniform float iGlobalTime;
varying vec2 fragCoord;

//
// This shader function is converted from "70s Wallpaper" from Shane on shadertoy.com
// https://www.shadertoy.com/view/ls33DN
//
void main() {
    vec2 uv = fragCoord.xy;

    float _x = uv.x / 50.0;
    float _y = uv.y / 50.0;

    _x *= sign(cos(length(ceil(_x), ceil(_y)) * 99.0));
    _x = fract(_x);
    _y = fract(_y);

    float pRange = min(length(_x, _y), length(_x - 1.0, _y - 1.0));
    
    vec4 c = vec4(clamp(sqrt(2.*cos(pRange * 1.0 * 6.3)), 0., 1.),
        clamp(sqrt(2.*cos(pRange * 3.0 * 6.3)), 0., 1.), 
        clamp(sqrt(2.*cos(pRange * 3.0 * 6.3)), 0., 1.),
        clamp(sqrt(2.*cos(pRange * 1.0 * 6.3)), 0., 1.));
    
    gl_fragColor = c;
}
