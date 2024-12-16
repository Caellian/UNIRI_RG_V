import { vec3, mat4, quat } from "../node_modules/gl-matrix/esm/index.js";
import {
  Format,
  canvasContext,
  vertexBuffer,
  uniform,
  animation,
  centerVertices,
  elementBuffer,
} from "./gfx.js";

const t60 = Math.sqrt(3);
const H = 0.5 * t60;
const VERTICES = [
  vec3.fromValues(-0.5, -0.5, 0.5),
  vec3.fromValues(0.5, -0.5, 0.5),
  vec3.fromValues(0, -0.5, 0.5 - H),
];
const inner = Math.sqrt(0.25 + (1 - H) * (1 - H));
const height = inner * t60;
VERTICES.push(vec3.fromValues(0, height - 0.5, 0.5 - H + inner));
// pomakne sve vrhove za (ishodište - geometrijska sredina)
centerVertices(VERTICES);
const INDICES = [0, 1, 2, 1, 0, 3, 2, 1, 3, 0, 2, 3];
const REGULAR_TETRAHEDRON = INDICES.map((i) => VERTICES[i]);
const REGULAR_TETRAHEDRON_COLORS = [
  ...Array(3).fill(vec3.fromValues(1.0, 0.5, 0)),
  ...Array(3).fill(vec3.fromValues(0.2, 0.8, 0.2)),
  ...Array(3).fill(vec3.fromValues(0.0, 0.5, 0.5)),
  ...Array(3).fill(vec3.fromValues(1.0, 0.5, 1.0)),
];

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

const onlyRotation = (rotation) =>
  mat4.fromRotationTranslationScale(
    mat4.create(),
    rotation,
    vec3.fromValues(0, 0, -10),
    vec3.fromValues(1, 1, 1)
  );

const step = 0.0007;
function drawWithArrays(gl, n) {
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
function setupRotation(gl, T, P, n, x, y, z, draw = drawWithArrays) {
  const rotation = quat.create();
  let currentAxis = quat.rotateX;
  animation((deltaTime) => {
    if (gl.visible) {
      currentAxis(rotation, rotation, step * deltaTime);
      const V = onlyRotation(rotation);
      mat4.multiply(V, P, V);
      T.set(V);
    }
    gl.clear();
    draw(gl, n);
  });

  x.onclick = () => {
    currentAxis = quat.rotateX;
  };
  y.onclick = () => {
    currentAxis = quat.rotateY;
  };
  z.onclick = () => {
    currentAxis = quat.rotateZ;
  };
}

export function main1() {
  const gl = canvasContext("#zad3-1", {
    mode: "3D",
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
  });
  const position = vertexBuffer(gl, "a_Position", Format.Vec3F);
  position.set(REGULAR_TETRAHEDRON);
  position.enable();
  const color = vertexBuffer(gl, "a_Color", Format.Vec3F);
  color.set(REGULAR_TETRAHEDRON_COLORS);
  color.enable();

  // transformacija koju ćemo kasnije definirati, za sada je identiteta
  const T = uniform(gl, "u_View", Format.Mat4F);
  const P = orthoFor(gl);
  T.set(P);
  gl.drawArrays(gl.TRIANGLES, 0, position.length);

  setupRotation(
    gl,
    T,
    P,
    position.length,
    document.getElementById("xButton"),
    document.getElementById("yButton"),
    document.getElementById("zButton")
  );
}

export function main2() {
  const gl = canvasContext("#zad3-2", {
    mode: "3D",
    vertex: VERTEX_SHADER,
    fragment: FRAGMENT_SHADER,
  });

  const POINTED_TETRAHEDRON = [
    ...VERTICES.slice(0, -1).map(vec3.clone), // potrebno kopiranje zbog centriranja
    vec3.fromValues(0, height + 0.5, 0.5 - H + inner),
  ];
  centerVertices(POINTED_TETRAHEDRON);

  const position = vertexBuffer(gl, "a_Position", Format.Vec3F);
  position.set(POINTED_TETRAHEDRON);
  position.enable();

  const POINTED_TETRAHEDRON_COLORS = [
    vec3.fromValues(0, 1, 1),
    vec3.fromValues(1, 0, 1),
    vec3.fromValues(1, 1, 0),
    vec3.fromValues(0.5, 0.5, 0.5),
  ];

  const color = vertexBuffer(gl, "a_Color", Format.Vec3F);
  color.set(POINTED_TETRAHEDRON_COLORS);
  color.enable();

  const elements = elementBuffer(gl, Format.U8);
  elements.set(INDICES);
  // ne trebamo pozivati gl.enableVertexAttribArray jer se podrazumijeva
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements.buffer);
  // ili nadalje elements.bind()

  // transformacija koju ćemo kasnije definirati, za sada je identiteta
  const T = uniform(gl, "u_View", Format.Mat4F);
  const P = orthoFor(gl);
  T.set(P);
  gl.drawElements(gl.TRIANGLES, INDICES.length, gl.UNSIGNED_BYTE, 0);

  setupRotation(
    gl,
    T,
    P,
    position.length,
    document.getElementById("xButton1"),
    document.getElementById("yButton1"),
    document.getElementById("zButton1"),
    () => {
      elements.draw();
    }
  );
}

window.main = () => {
  main1();
  main2();
};
