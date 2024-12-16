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
async function main() {
  let gl = init(
    document.getElementById("zad8"),
    VSHADER_SOURCE,
    FSHADER_SOURCE
  );
  const position = vertexBuffer(gl, "a_Position", Format.Vec2F)
    .set([-0.5, -0.5, 0.5, -0.5, 0, H])
    .enable();
  const T = uniform(gl, "u_Transform", Format.Mat4F);

  let translation = new Float32Array([
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ]);
  let btn_i = document.getElementById("z8_i_btn");
  let btn_v = document.getElementById("z8_v_btn");
  btn_i.onclick = () => {
    translation[13] = 0;
    btn_i.classList.add("active");
    btn_v.classList.remove("active");
  };
  btn_v.onclick = () => {
    translation[13] = -H;
    btn_v.classList.add("active");
    btn_i.classList.remove("active");
  };

  const step = 0.001;
  let theta = 0.1;

  animation((delta) => {
    theta += delta * step;
    if (theta > 2 * Math.PI) {
      theta -= 2 * Math.PI;
    }
    const s = Math.sin(theta);
    const c = Math.cos(theta);

    const rotation = new Float32Array([
      c,
      s,
      0,
      0,
      -s,
      c,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ]);

    T.set(
      glMatrix.mat4.multiply(glMatrix.mat4.create(), rotation, translation)
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, position.length);
  });
}
