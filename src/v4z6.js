const VSHADER_SOURCE = `
uniform mat4 u_Transform;

attribute vec2 a_Position;

void main() {
  gl_Position = u_Transform * vec4(a_Position, 0.0, 1.0);
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
    document.getElementById("zad6"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F)
    .set([-0.5, -0.5, 0.5, -0.5, 0, H])
    .enable();
  uniform(gl, "u_Transform", Format.Mat4F).set(
    new Float32Array([1.5, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  );
  gl.drawArrays(gl.TRIANGLES, 0, position.length);
}
