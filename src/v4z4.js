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
    document.getElementById("zad4-1"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F);
  position.set([
    /* od */ 0, 0, /* do */ 0, 0.5 /* i između */, /* od */ -0.5, 0.5,
    /* do */ -0.5, -0.5 /* i između */, /* od */ 0, -0.5, /* do */ 0, 0,
  ]);
  position.enable();
  gl.drawArrays(gl.LINE_STRIP, 0, position.length);

  let gl2 = init(
    document.getElementById("zad4-2"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position2 = vertexBuffer(gl2, "a_Position", Format.Vec2F);
  const H = 0.25 * Math.sqrt(3);
  position2.set([
    /* od */ -0.5,
    0,
    /* do */ -0.25,
    H,
    /* od */ 0,
    0,
    /* do */ 0.25,
    H,
    /* od */ 0.5,
    0 /* do početka */,
  ]);
  position2.enable();
  gl2.drawArrays(gl2.LINE_LOOP, 0, position2.length);
}
