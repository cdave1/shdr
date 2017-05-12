function vec2(x, y) {
	if (x == null) x = 0;
	if (y == null) y = x;
	return [x, y]
}
vec2.divide = function anonymous(out,a,b
/**/) {
out[0] = a[0] / b[0];
out[1] = a[1] / b[1]
return out;
}
vec2.multiply = function anonymous(out,a,b
/**/) {
out[0] = a[0] * b[0];
out[1] = a[1] * b[1]
return out;
}
function sin(angle) {
	if (angle.length) return angle.map(sin);
	return Math.sin(angle);
}
function fract(x) {
	if (x.length) return x.map(fract);
	return x - Math.floor(x);
}
function log(x) {
	if (x.length) return x.map(log);
	return Math.log(x);
}
function dot(x, y) {
	var sum = 0;
	for (var i = 0; i < x.length; i++) {
		sum += x[i]*y[i];
	}
	return sum;
}
function abs(x) {
	if (x.length) return x.map(abs);
	return Math.abs(x);
}
function vec3(x, y, z) {
	if (x == null) x = 0;
	if (y == null) y = x;
	if (z == null) z = y;
	return [x, y, z]
}
vec3.add = function anonymous(out,a,b
/**/) {
out[0] = a[0] + b[0];
out[1] = a[1] + b[1];
out[2] = a[2] + b[2]
return out;
}
function exp(x) {
	if (x.length) return x.map(exp);
	return Math.exp(x);
}
function pow(x, y) {
	if (x.length) return x.map(function (x, i) {
		return Math.pow(x, y[i]);
	});
	return Math.pow(x, y);
}
function max(x, y) {
	if (x.length) {
		if (y.length) return x.map(function (x, i) {
			return Math.max(x, y[i]);
		});
		return x.map(function (x, i) {
			return Math.max(x, y);
		});
	}
	return Math.max(x, y);
}
function mix(x, y, a) {
	if (x.length) {
		if (a.length) return x.map(function (x, i) {
			return mix(x, y[i], a[i]);
		});
		return x.map(function (x, i) {
			return mix(x, y[i], a);
		});
	}

	return x * (1.0 - a) + y * a;
}
var iResolution = uniforms.iResolution;
var iGlobalTime = uniforms.iGlobalTime;
var iTexture0 = uniforms.iTexture0;
var iMouse = uniforms.iMouse;
function field (p) {
	var strength = 7. + .03 * log(1.e-6 + fract(sin(iGlobalTime) * 4373.11));
	var accum = 0.;
	var prev = 0.;
	var tw = 0.;
	for (var i = 0; i < 32; ++i) {
	var mag = dot(p, p);
	p = vec3.add([], abs(p).map(function (_) {return _ / mag;}), [-.5, -.4, -1.5]);
	var w = exp(-i / 7.);
	accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
	tw += w;
	prev = mag;
	};
	return max(0., 5. * accum / tw - .7);
};
function main () {
	var loc = [1000.0 * texture_coordinate[0], 1000.0 * texture_coordinate[1] - 500.];
	var uv = vec2.divide([], loc.map(function (_) {return 2. * _;}), [0, 1].map(function (x, i) { return this[x]}, iResolution)).map(function (_) {return _ - 1.;});
	var uvs = vec2.multiply([], uv, [0, 1].map(function (x, i) { return this[x]}, iResolution)).map(function (_) {return _ / this;}, max(iResolution[0], iResolution[1]));
	var p = vec3.add([], uvs.map(function (_) {return _ / 4.;}).concat(0), [1., -1.3, 0.]);
	var speed = 0.01;
	p = vec3.add([], p, [sin(iGlobalTime * speed / 16.), sin(iGlobalTime * speed / 12.), sin(iGlobalTime * speed / 128.)].map(function (_) {return .2 * _;}));
	var t = field(p);
	var v = (1. - exp((abs(uv[0]) - 1.) * 6.)) * (1. - exp((abs(uv[1]) - 1.) * 6.));
	var color = [1.8 * t * t * t, 1.4 * t * t, t, 1.0].map(function (_) {return this * _;}, mix(.4, 1., v));
	gl_FragColor = color;
};
