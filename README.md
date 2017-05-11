# shdr

An experimental emulator for glsl-style fragment shaders that runs on the CPU.  Useful when standard GPU debugging methods won't cut it, and you want to inspect variables on a standard debugger on the CPU.  The shader output is exported to a png.

![Shader example 1](https://github.com/cdave1/shdr/raw/master/img/test.png)
![Shader example 2](https://github.com/cdave1/shdr/raw/master/img/testPattern.png)


# Current Limitations

The goal of shdr is to allow complete emulation of glsl in javascript, a language with excellent debugging support.  However, the library (currently) only emulates a small portion of glsl, so you need to convert unsupported glsl features directly to javascript to use it properly.

To give an example, shadertoy's default shader looks like this, in glsl:

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord.xy / iResolution.xy;
        fragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);
    }

This needs to be converted to the following to run properly in shdr:

    function test(fragColor, fragCoord) {
        fragColor[0] = fragCoord.x / iResolution.x;
        fragColor[1] = fragCoord.y / iResolution.y;
        fragColor[2] = 0.5 + 0.5 * sin(iGlobalTime);
        fragColor[3] = 1.0;
    }

There are some additional limitations:
* Runs on the CPU without threads or parallelization.
* glsl library functions are just global wrappers around basic javascript Math library functions.
* Only runs one frame at a time.
* Slow as hell.
* No swizzling or overloading.
* Dumps output to png.

# Plans

The usual method of debugging glsl is to dump your suspect variable out to gl_FragColor.  This gives you fast visual feedback for what your values are and where they might be going wrong.  It is usually the best method for debugging glsl.

This debugging method stops being effective when your shaders become more complex, particularly when you need to debug multiple variables.  Sometimes, you just want to look at your variables in a standard debugger, or to dump them out to the console.

I think the Visual Studio Code javascript debugger is the best available for any IDE or programming language, and it's what I've been testing this on.  Javascript is also a good choice as an emulation language, since it already has very similar syntax to glsl.

This library may also be useful as a server-based program that can be used to generate static images with glsl, particularly in cases when an OpenGL context is impossible to create.


# Example

Standard test shader (test.js):

    const shdr = require('./index');

    function test(fragColor, fragCoord) {
        fragColor[0] = fragCoord.x / iResolution.x;
        fragColor[1] = fragCoord.y / iResolution.y;
        fragColor[2] = 0.5 + 0.5 * sin(iGlobalTime);
        fragColor[3] = 1.0;
    }

    shdr(test, 'test.png');

Then:

    node test

The resulting png will look like this:

![Shader example 1](https://github.com/cdave1/shdr/raw/master/img/test.png)


# TODO

* Be able to load glsl code directly by supporting all the library functions, swizzling methods, constructors, etc.
* Support for multiple frames.
* Use all of shadertoy's global variables.
* Pipe shader functions together.
