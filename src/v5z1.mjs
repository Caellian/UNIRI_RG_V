import { vec3, mat4, quat } from "../node_modules/gl-matrix/esm/index.js";
import { Format, canvasContext, vertexBuffer, uniform } from "./gfx.js";

const CUBE_VERTICES = [
  vec3.fromValues(-0.5, -0.5, 0.5), // 0
  vec3.fromValues(0.5, -0.5, 0.5), // 1
  vec3.fromValues(0.5, 0.5, 0.5), // 2
  vec3.fromValues(-0.5, 0.5, 0.5), // 3
  vec3.fromValues(-0.5, -0.5, -0.5), // 4
  vec3.fromValues(0.5, -0.5, -0.5), // 5
  vec3.fromValues(0.5, 0.5, -0.5), // 6
  vec3.fromValues(-0.5, 0.5, -0.5), // 7
];
const CUBE_INDICES = [
  // Front               // Back
  0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6,
  // Left                // Right
  0, 3, 4, 3, 7, 4, 1, 5, 6, 1, 6, 2,
  // Top                 // Bottom
  3, 2, 6, 3, 6, 7, 5, 1, 0, 4, 5, 0,
];
const FLAT_CUBE = CUBE_INDICES.map((i) => CUBE_VERTICES[i]);

const CUBE_COLORS = (() => {
  const third = CUBE_INDICES.length / 3;
  return [
    ...Array(third).fill(vec3.fromValues(1.0, 0.0, 1.0)),
    ...Array(third).fill(vec3.fromValues(0.0, 1.0, 0.0)),
    ...Array(third).fill(vec3.fromValues(0.0, 0.0, 1.0)),
  ];
})();

const VERTEX_SHADER = `
attribute vec3 a_Position;
attribute vec3 a_Color;

uniform mat4 u_View;

varying vec3 color;

void main() {
  gl_Position = u_View * vec4(a_Position, 1.0);
  color = a_Color;
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

export function main() {
  const gl = canvasContext("#zad1", {
    mode: "3D",
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
  });

  const position = vertexBuffer(gl, "a_Position", Format.Vec3F);
  position.set(FLAT_CUBE);
  position.enable();
  const color = vertexBuffer(gl, "a_Color", Format.Vec3F);
  color.set(CUBE_COLORS);
  color.enable();

  // transformacija koju ćemo kasnije definirati, za sada je identiteta
  const T = uniform(gl, "u_View", Format.Mat4F);

  const orthoFor = (gl) => {
    const aspect = gl.canvas.width / gl.canvas.height;
    return mat4.orthoNO(
      mat4.create(),
      -1 * aspect, // left
      1 * aspect, // right
      1, // bottom
      -1, // top
      0.001, // near
      1000 // far
    );
  };
  let P = orthoFor(gl);
  // pogled
  const onlyRotation = (rotation) =>
    mat4.fromRotationTranslationScale(
      mat4.create(),
      rotation,
      vec3.fromValues(0, 0, -10),
      vec3.fromValues(1, 1, 1)
    );
  let V = onlyRotation(quat.fromEuler(quat.create(), 30, 10, 0));
  mat4.multiply(V, P, V);
  T.set(V);

  gl.drawArrays(gl.TRIANGLES, 0, position.length);
}

window.main = main;
