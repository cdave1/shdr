# shdr

An experimental emulator for glsl fragment shaders that runs on the CPU.  Useful when standard GPU debugging methods won't cut it, and you want to inspect variables on a standard debugger on the CPU.  The shader output is exported to a png.

![Shader example 1](https://github.com/cdave1/shdr/raw/master/img/test.png)
![Shader example 2](https://github.com/cdave1/shdr/raw/master/img/testPattern.png)

# Usage

Create a glsl fragment shader in a file, like the following:

    #version 330

    uniform vec2 iResolution;
    uniform float iGlobalTime;
    varying vec2 fragCoord;

    void main() {
        vec2 uv = fragCoord.xy / iResolution.xy;
        gl_fragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);
    }

And then evaluate as follows:

    const shdr = require('shdr');
    var shaderFileLocation = 'path/to/shader.glsl';
    var exportFileLocation = 'path/to/export.png';
    shdr.eval(shaderFileLocation, exportFileLocation);

The shader output will be exported to a png file like this:

![Shader example 1](https://github.com/cdave1/shdr/raw/master/img/test.png)


# Motivations

To debug glsl, the usual method is to simply dump suspect variables out to gl_FragColor.  This provides fast visual feedback for where things might be going wrong.  It is usually the best method for debugging glsl, and is particularly useful in conjunction with a tool like [ShaderToy](https://www.shadertoy.com).

This debugging method stops being effective when your shaders become more complex, particularly when you need to debug multiple variables.  Sometimes, you just want to look at your variables in a standard debugger, or to dump them out to the console.

I think the Visual Studio Code javascript debugger is the best available for any IDE or programming language, and it's what I've been testing this on.  Javascript is also a good choice as an emulation language, since it already has very similar syntax to glsl.

This library may also be useful as a server-based program that can be used to generate static images with glsl, particularly in cases when an OpenGL context is impossible to create.


# Current Limitations

* Runs on the CPU without threads or parallelization.
* glsl is evaluated to javascript, but the javascript does not quite match the glsl, so it can be hard to match up line numbers when an error is produced.
* Only runs one frame at a time.
* Slow as hell.
* No swizzling or overloading.
* Dumps output to png.


# TODO

* (DONE) Be able to load glsl code directly by supporting all the library functions, swizzling methods, constructors, etc.
* Support for multiple frames.
* Use all of shadertoy's global variables.
* Pipe shader functions together.
