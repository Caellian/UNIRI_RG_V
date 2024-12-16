import { vec3, mat4, quat } from "../node_modules/gl-matrix/esm/index.js";
import {
  Format,
  canvasContext,
  vertexBuffer,
  uniform,
  centerVertices,
  animation,
} from "./gfx.js";

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
const SCALE_XZ = mat4.fromValues(
  0.5,
  0,
  0,
  0,
  0,
  0.3,
  0,
  0,
  0,
  0,
  0.5,
  0,
  0,
  0,
  0,
  1
);
const TRUNCATED_PYRAMID_VERTICES = CUBE_VERTICES.map(vec3.clone).map((v) => {
  if (v[1] > 0) {
    vec3.transformMat4(v, v, SCALE_XZ);
  }
  return v;
});
centerVertices(TRUNCATED_PYRAMID_VERTICES);
// indeksi ostaju isti kao i za kocku
const TRUNCATED_PYRAMID = CUBE_INDICES.map(
  (i) => TRUNCATED_PYRAMID_VERTICES[i]
);
const TP_COLORS = (() => {
  const face = CUBE_INDICES.length / 6;
  const c = (r, g, b) => vec3.fromValues(r / 255, g / 255, b / 255);
  const fc = (r, g, b) => Array(face).fill(c(r, g, b));
  return [
    ...fc(51, 186, 204),
    ...fc(81, 145, 255),
    ...fc(255, 120, 219),
    ...fc(192, 193, 255),
    ...fc(108, 83, 187),
    ...fc(210, 155, 61),
  ];
})();

const VERTEX_SHADER = `
attribute vec3 a_Position;
attribute vec3 a_Color;

uniform mat4 u_Projection;
uniform mat4 u_Model;

varying vec3 color;

void main() {
  gl_Position = u_Projection * u_Model * vec4(a_Position, 1.0);
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
  const gl = canvasContext("#zad4", {
    mode: "3D",
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
  });
  const points = vertexBuffer(gl, "a_Position", Format.Vec3F)
    .set(TRUNCATED_PYRAMID)
    .enable();
  vertexBuffer(gl, "a_Color", Format.Vec3F).set(TP_COLORS).enable();
  const aspect = gl.canvas.width / gl.canvas.height;
  uniform(gl, "u_Projection", Format.Mat4F).set(
    mat4.multiply(
      mat4.create(),
      mat4.perspectiveNO(
        mat4.create(),
        Math.PI / 3, // fovy
        aspect, // aspect ratio
        0.001, // near
        1000 // far
      ),
      mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, -2))
    )
  );
  const M = uniform(gl, "u_Model", Format.Mat4F);

  let xState = 0;
  let yState = 0;
  let rotationState = mat4.create();
  const SENSITIVITY = 0.3;
  function addRotation(x, y) {
    let xState = x * SENSITIVITY;
    let yState = y * SENSITIVITY;
    const change = mat4.fromQuat(
      mat4.create(),
      quat.fromEuler(quat.create(), yState, xState, 0)
    );
    mat4.multiply(rotationState, change, rotationState);
  }

  animation(() => {
    addRotation(5, 2);
    M.set(rotationState);
    gl.clear();
    points.draw();
  });
}

window.main = main;
