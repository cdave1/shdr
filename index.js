'use strict';

var shdr = {};

global.min = Math.min;

global.max = Math.max;

global.sin = Math.sin;

global.cos = Math.cos;

global.tan = Math.tan;

global.ceil = Math.ceil;

global.floor = Math.floor;

global.sqrt = Math.sqrt;

global.sign = function(a) {
    return (a < 0) ? -1.0 : (a == 0.0) ? 0.0 : 1.0;
}

global.fract = function(a) {
    return a - Math.floor(a);
}

global.clamp = (x, lo, hi) => {
    return min(hi, max(lo, x));
}

global.length = (a, b) => {
    return Math.sqrt((a * a) + (b * b));
}

shdr.shdrHeadless = function(exportLocation) {
    var _exportLocation = exportLocation || "./output.png";
    var width   = 256
    var height  = 256
    var gl = require('headless-gl')(width, height, { preserveDrawingBuffer: true })

    //Clear screen to red
    gl.clearColor(1, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    //Write output as a PPM formatted image
    var pixels = new Uint8Array(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    var png = new PNG({width: width, height: height});
    for(var i=0; i<pixels.length; i+=4) {
        for(var j=0; j<3; ++j) {
            png.data[i+j]   = pixels[i+j];
        }
        png.data[i+3] = 255;
    }

    png.pack().pipe(fs.createWriteStream(_exportLocation));
    console.log("Exported png to", _exportLocation);
}


global.uniforms = {};
global.varyings = {};
global.uniforms.iResolution = [1.0, 1.0];
global.uniforms.iGlobalTime = 0.5;

global.gl_fragColor = [0, 0, 0, 0];
global.fragCoord = {x: 0, y: 0};

function runShaderSource(shaderSource, opts) {
    const vm = require('vm');
    var _exportLocation = opts && opts.exportLocation || "./output.png";
    var _width = opts && opts.width || 512.0;
    var _height = opts && opts.height || 512.0;

    uniforms.iResolution = [_width, _height];
    uniforms.iGlobalTime = 0.5;

    console.log(shaderSource);

    var evalResult = vm.runInThisContext(shaderSource);

    gl_fragColor = [0, 0, 0, 0];
    fragCoord = {x: 0, y: 0};

    var png = new PNG({width: _width, height: _height});

    for (var y = 0.0; y < _height; y += 1.0) {
        for (var x = 0.0; x < _width; x += 1.0) {
            global.texture_coordinate = [x / _width, y / _height];
            
            //gl_fragColor = [0, 0, 0, 0];
            //fragCoord = {x: x, y: y };
            fragCoord = [x, y];
            main();
            //console.log(global.varyings.fragCoord);
            var color = gl_fragColor;
            
            const idx = (_width * y + x) * 4;
            png.data[idx]   = 255 * color[0];
            png.data[idx+1] = 255 * color[1];
            png.data[idx+2] = 255 * color[2];
            png.data[idx+3] = 255;
        }
    }

    png.pack().pipe(fs.createWriteStream(_exportLocation));
    console.log("Exported png to", _exportLocation);
}


shdr.eval = function(glslPath, opts) {
    var GLSL = require('glsl-transpiler');
    var glslify = require('glslify');
    var source = glslify(glslPath); //seventies.glsl');

    var compile = GLSL({
        uniform: function (name) {
            return `uniforms.${name}`;
        },
        attribute: function (name) {
            return `attributes.${name}`;
        },
        varying: function (name) {
            return `varyings.${name}`;
        }
    });

    var result = compile(source);
    return runShaderSource(result, opts);
}



shdr.evalFunction = function(func, opts) {
    var _exportLocation = opts && opts.exportLocation || null;
    var _width = opts && opts.width || 512.0;
    var _height = opts && opts.height || 512.0;

    global.fragColor = [0, 0, 0, 0];
    global.fragCoord = {x: 0, y: 0};

    uniforms.iResolution = [_width, _height];
    uniforms.iGlobalTime += 0.2;

    var buffer = new Array(_width * _height * 4);

    for (var y = 0.0; y < _height; y += 1.0) {
        for (var x = 0.0; x < _width; x += 1.0) {
            fragCoord = {x: x, y: y };
            func();
            var color = fragColor;
            
            const idx = (_width * y + x) * 4;
            buffer[idx] = 255 * color[0];
            buffer[idx+1] = 255 * color[1];
            buffer[idx+2] = 255 * color[2];
            buffer[idx+3] = 255;
        }
    }

    if (_exportLocation) {
        const fs = require('fs');

        var png = new PNG({width: _width, height: _height});

        for (idx = 0; idx < buffer.length; idx +=4) {
            png.data[idx]   = buffer[idx];
            png.data[idx+1] = buffer[idx+1];
            png.data[idx+2] = buffer[idx+2];
            png.data[idx+3] = buffer[idx+3];
        }

        png.pack().pipe(fs.createWriteStream(_exportLocation));
        console.log("Exported png to", _exportLocation);
    }

    return buffer;
}

module.exports = shdr;
