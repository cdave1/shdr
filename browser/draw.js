const shdr = require('../index.js');

//
// This shader function is converted from "70s Wallpaper" from Shane on shadertoy.com
// https://www.shadertoy.com/view/ls33DN
//
function TestPattern() {
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


function sin(angle) {
	if (angle.length) return angle.map(sin);
	return Math.sin(angle);
}

function shimmer() {
	var uv = [fragCoord.x / uniforms.iResolution[0], fragCoord.y / uniforms.iResolution[1]];
	fragColor = [uv[0], uv[1], 0.5 + 0.5 * sin(uniforms.iGlobalTime), 1];
};


function draw() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var buffer = shdr.evalFunction(shimmer, {width: canvas.width, height: canvas.height});

    var imageData = ctx.createImageData(canvas.width, canvas.height);
    for (var idx = 0; idx < buffer.length; idx += 4) {
        imageData.data[idx] = buffer[idx];
        imageData.data[idx + 1] = buffer[idx + 1];
        imageData.data[idx + 2] = buffer[idx + 2];
        imageData.data[idx + 3] = buffer[idx + 3];
    }

    ctx.putImageData(imageData, 0, 0);

    setTimeout(draw, 40);
}

draw();
