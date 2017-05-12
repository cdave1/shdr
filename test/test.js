const shdr = require('../index');

function sin(angle) {
	if (angle.length) return angle.map(sin);
	return Math.sin(angle);
}
var iResolution = uniforms.iResolution;
var iGlobalTime = uniforms.iGlobalTime;
var fragCoord = [0, 0];
function main () {
	var uv = [fragCoord[0] / iResolution[0], fragCoord[1] / iResolution[1]];
	gl_fragColor = [uv[0], uv[1], 0.5 + 0.5 * sin(iGlobalTime), 1];
};

shdr.evalFunction(main, 'test.png');