'use strict';

const fs = require('fs');
const PNG = require('pngjs').PNG;

global.sign = function(a) {
    return (a < 0) ? -1.0 : (a == 0.0) ? 0.0 : 1.0;
}

global.fract = function(a) {
    return a - Math.floor(a);
}

global.min = (a, b) => {
    return Math.min(a, b)
}

global.max = (a, b) => {
    return Math.max(a, b);
}

global.clamp = (x, lo, hi) => {
    return min(hi, max(lo, x));
}

global.length = (a, b) => {
    return Math.sqrt((a * a) + (b * b));
}

global.sin = (x) => {
    return Math.sin(x);
}

global.cos = (x) => {
    return Math.cos(x);
}

global.tan = (x) => {
    return Math.tan(x);
}

global.ceil = (x) => {
    return Math.ceil(x);
}

global.sqrt = (x) => {
    return Math.sqrt(x);
}

global.iResolution = { x: 1200.0, y: 1200.0 };

global.iGlobalTime = 0.5;

function shdr(func, exportLocation) {
    var size = {width: iResolution.x, height: iResolution.y };
    var png = new PNG({width: size.width, height: size.height});

    for (var y = 0.0; y < size.height; y += 1.0) {
        for (var x = 0.0; x < size.width; x += 1.0) {
            var color = [0.0, 0.0, 0.0, 0.0];
            func(color, {x: x, y: y});
            
            const idx = (size.width * y + x) * 4;
            png.data[idx]   = 255 * color[0];
            png.data[idx+1] = 255 * color[1];
            png.data[idx+2] = 255 * color[2];
            png.data[idx+3] = 255;
        }
    }

    png.pack().pipe(fs.createWriteStream(exportLocation));
    console.log("Exported png to", exportLocation);
}

module.exports = shdr;
