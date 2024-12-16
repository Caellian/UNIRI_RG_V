const VSHADER_SOURCE = `
attribute vec2 a_Position;
attribute float a_boxSize;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  gl_PointSize = a_boxSize;
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

function DeviceToNormalised(canvas, pos) {
  const xPx = 2.0 / canvas.width;
  const yPx = -2.0 / canvas.height;
  return {
    x: Math.round((pos.x - canvas.width / 2) * xPx * 100) / 100,
    y: Math.round((pos.y - canvas.height / 2) * yPx * 100) / 100,
  };
}
function init(canvas, vertex = VSHADER_SOURCE, fragment = FSHADER_SOURCE) {
  if (canvas == null) {
    return;
  }

  // Postavljanje konteksta renderiranja za WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Inicijalizacija shadera
  if (!initShaders(gl, vertex, fragment)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
}

function draw_point(gl, position, size) {
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }
  gl.vertexAttrib2f(a_Position, position.x, position.y);
  var a_boxSize = gl.getAttribLocation(gl.program, "a_boxSize");
  if (a_boxSize < 0) {
    console.log("Failed to get the storage location of a_boxSize");
    return;
  }
  gl.vertexAttrib1f(a_boxSize, size);

  gl.clear(gl.COLOR_BUFFER_BIT);

  // Crtanje tocaka
  gl.drawArrays(gl.POINTS, 0, 1);
}

function main() {
  let canvas = document.getElementById("glcanvas");
  let ctx = init(canvas);
  let lastPos = {
    x: Math.round(Math.random() * canvas.width),
    y: Math.round(Math.random() * canvas.height),
  };
  let lastSize = 20 + 40 * Math.random();
  let norm = DeviceToNormalised(canvas, lastPos);
  draw_point(ctx, norm, lastSize);
}
