const VSHADER_SOURCE = `
attribute vec2 a_Position;

void main() {
  gl_Position = vec4(a_Position, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`;

const FSHADER_SOURCE = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}
`;

function main() {
  let gl = init(
    document.getElementById("zad1"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  let points = [-1, -1, -1, 1, 1, -1, 1, 1];
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F);
  position.set(points);
  position.enable();
  gl.drawArrays(gl.POINTS, 0, position.length);
}
