# shdr

![Shader example 1](https://github.com/cdave1/shdr/raw/master/test.png)
![Shader example 2](https://github.com/cdave1/shdr/raw/master/testPattern.png)

Emulator for glsl fragment shaders in possibly the dumbest way you could imagine:
* Fake glsl code is actually just javascript, so you can't copy and paste glsl code in.
* Run on the CPU without threads or parallelization.
* Fake glsl library functions are just gloabl wrappers around basic javascript Math library functions.
* Only one frame at a time.
* Slow as hell.
* No swizzling or overloading (yet!).
* Dumps output to png.

# Benefits

The usual method of debugging glsl is to dump your suspect variable out to gl_FragColor.  This gives you fast visual feedback for what your values and where they might be going wrong.

This stops being effective as your shaders become more complex, particularly when you want to inspect the value of multiple variables.  Sometimes, you just want to look at your variables as if you're in any old debugger, which is what I'm attempting to build here.


# Example

Standard test shader:

    const shdr = require('./index');

    function test(fragColor, fragCoord) {
        var uv = fragCoord.xy / iResolution.xy;
        fragColor[0] = fragCoord.x / iResolution.x;
        fragColor[1] = fragCoord.y / iResolution.y;
        fragColor[2] = 0.5 + 0.5 * sin(iGlobalTime);
        fragColor[3] = 1.0;
    }

    shdr(test, 'test.png');


