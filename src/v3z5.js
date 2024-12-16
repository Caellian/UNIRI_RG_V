const VSHADER_SOURCE = `
void main() {
  gl_Position = vec4(0.2, 0.3, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

function main() {
  // Dohvacanje <canvas> elementa
  var canvas = document.getElementById("glcanvas");

  // Postavljanje konteksta renderiranja za WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.error("Failed to get the rendering context for WebGL");
    return;
  }

  // Inicijalizacija shadera
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error("Failed to intialize shaders.");
    return;
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Crtanje tocaka
  gl.drawArrays(gl.POINTS, 0, 1);
}
