const VSHADER_SOURCE = `
uniform vec2 u_Translation;

attribute vec2 a_Position;

void main() {
  gl_Position = vec4(a_Position + u_Translation, 0.0, 1.0);
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

const H = 0.25 * Math.sqrt(3);
function main() {
  let gl = init(
    document.getElementById("zad5"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F);
  position.set([-0.5, -0.5, 0.5, -0.5, 0, H]);
  position.enable();
  const translation = uniform(gl, "u_Translation", Format.Vec2F);
  translation.set([0.2, 0.2]);
  gl.drawArrays(gl.TRIANGLES, 0, position.length);
}
