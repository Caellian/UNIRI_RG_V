function main() {
  // Dohvacanje <canvas> elementa
  var canvas = document.getElementById("glcanvas");

  // Postavljanje konteksta renderiranja za WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Specificiranje boje za brisanje <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Brisanje <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
