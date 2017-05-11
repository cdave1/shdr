const shdr = require('./index');

//
// Basic test shader.
//
function test(fragColor, fragCoord) {
    var uv = fragCoord.xy / iResolution.xy;
	fragColor[0] = fragCoord.x / iResolution.x;
    fragColor[1] = fragCoord.y / iResolution.y;
    fragColor[2] = 0.5 + 0.5 * sin(iGlobalTime);
    fragColor[3] = 1.0;
}

shdr(test, 'test.png');