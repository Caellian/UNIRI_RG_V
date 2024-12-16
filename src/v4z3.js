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
    document.getElementById("zad3"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F);
  position.set([
    /* od */ -0.9, 0.8, /* do */ -0.4, -0.8, /* od */ -0.2, 0.6, /* do */ 0.4,
    0.2, /* od */ 0.8, -0.2, /* do */ 0.8, 0.8,
  ]);
  position.enable();
  gl.drawArrays(gl.LINES, 0, position.length);
}
