const VSHADER_SOURCE = `
attribute vec2 a_Position;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

function main() {
  let gl = init(
    document.getElementById("zad9"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F);
  position.set([
    -0.7, 0.5, -0.7, -0.3, 0.5, 0.5, 0.5, 0.5, -0.7, -0.3, 0.5, -0.3,
  ]);
  position.enable();
  gl.drawArrays(gl.TRIANGLES, 0, position.length);
}
