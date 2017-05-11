const shdr = require('./index');

//
// This shader function is converted from "70s Wallpaper" from Shane on shadertoy.com
// https://www.shadertoy.com/view/ls33DN
//
function TestPattern(fragColor, fragCoord) {
    var _x = fragCoord.x / 50.0;
    var _y = fragCoord.y / 50.0;
    
    _x *= sign(cos(length(ceil(_x), ceil(_y)) * 99.0));
    _x = fract(_x);
    _y = fract(_y);

    var pp = min(length(_x, _y), length(_x - 1.0, _y - 1.0));
    
    [1.0, 3.0, 3.0, 1.0].forEach((c, i) => {
        fragColor[i] = clamp(sqrt(2.0 * cos(pp * c * 6.3)), 0.0, 1.0);
    });
}

shdr(TestPattern, 'testPattern.png');