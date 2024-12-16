const GL = WebGL2RenderingContext;

const Format = Object.freeze({
  Vec2F: {
    source: Float32Array,
    size: 2,
    glType: GL.FLOAT,
    glSetUniform: (gl, l, data) => gl.uniform2fv(l, data),
  },
  Vec3F: {
    source: Float32Array,
    size: 3,
    glType: GL.FLOAT,
    glSetUniform: (gl, l, data) => gl.uniform3fv(l, data),
  },
  Vec4F: {
    source: Float32Array,
    size: 4,
    glType: GL.FLOAT,
    glSetUniform: (gl, l, data) => gl.uniform4fv(l, data),
  },
  Mat3F: {
    source: Float32Array,
    size: [3, 3],
    glType: GL.FLOAT,
    glSetUniform: (gl, l, data, transpose = false) =>
      gl.uniformMatrix3fv(l, transpose, data),
  },
  Mat4F: {
    source: Float32Array,
    size: [4, 4],
    glType: GL.FLOAT,
    glSetUniform: (gl, l, data, transpose = false) =>
      gl.uniformMatrix4fv(l, transpose, data),
  },
});

function vertexBuffer(
  gl,
  name,
  format,
  usage = GL.STATIC_DRAW,
  program = undefined
) {
  if (typeof format !== "object") {
    throw new Error("invalid vertex format", {
      cause: { format },
    });
  }
  if (typeof format.size !== "number") {
    throw new Error("format size not a number", {
      cause: { format },
    });
  }
  const glProgram = program || gl.program;
  const location = gl.getAttribLocation(glProgram, name);
  if (location < 0) {
    throw new Error(`failed to get the storage location of ${name}`, {
      cause: {
        attribute: name,
        context: gl,
        program: glProgram,
      },
    });
  }
  const buffer = gl.createBuffer();
  const result = {
    name,
    location,
    format,
    buffer,
    usage,
    length: 0,
    context: gl,
    program: glProgram,
    configured: false,
    bind() {
      result.context.bindBuffer(GL.ARRAY_BUFFER, result.buffer);
      return result;
    },
    set(data, transpose = false) {
      let arrayBuffer;
      if (data == null) {
        return result;
      } else if (data instanceof result.format.source) {
        arrayBuffer = data;
      } else if (Array.isArray(data)) {
        const flat = [];
        for (const entry of data) {
          if (typeof entry === "number") {
            flat.push(entry);
          } else if (typeof entry.toArray === "function") {
            flat.push(...entry.toArray().slice(0, result.format.size));
          } else if (entry[Symbol.iterator] != null) {
            flat.push(...[...entry].slice(0, result.format.size));
          }
        }
        arrayBuffer = new result.format.source(flat);
      } else {
        throw new Error("invalid attribute data", {
          cause: {
            dataType: typeof data,
            data,
          },
        });
      }
      result.data = arrayBuffer;
      result.length = result.data.length / result.format.size;
      result.context.bindBuffer(GL.ARRAY_BUFFER, result.buffer);
      result.context.bufferData(GL.ARRAY_BUFFER, arrayBuffer, result.usage);
      if (!result.configured) {
        result.context.vertexAttribPointer(
          location,
          format.size,
          format.glType,
          format.normalize || false,
          format.stride || 0,
          format.offset || 0
        );
        result.configured = true;
      }
      return result;
    },
    enable() {
      result.context.enableVertexAttribArray(result.location);
      return result;
    },
    disable() {
      result.context.disableVertexAttribArray(result.location);
      return result;
    },
    delete() {
      result.context.disableVertexAttribArray(result.location);
      result.context.deleteBuffer(result.buffer);
      return result;
    },
    forContext(gl, program = undefined) {
      return vertexBuffer(
        gl,
        result.name,
        result.format,
        result.usage,
        program || gl.program
      ).set(result.data);
    },
  };
  return result;
}

function identity(x, y) {
  const result = new Float32Array(Array(x * y).fill(0));

  for (let yi = 0; yi < y; yi++) {
    for (let xi = 0; xi < x; xi++) {
      result[xi + yi * x] = 1.0;
    }
  }

  return result;
}

function uniform(gl, name, format, program = undefined) {
  const glProgram = program || gl.program;
  var location = gl.getUniformLocation(glProgram, name);
  if (location < 0) {
    console.log(`Failed to get the storage location of ${name}`);
    return;
  }
  let I;
  let baseLength;
  if (typeof format.size === "number") {
    I = new Float32Array(Array(format.size).fill(0));
    baseLength = format.size;
  } else if (Array.isArray(format.size)) {
    I = identity(format.size[0], format.size[1]);
    baseLength = format.size[0] * format.size[1];
  }
  const result = {
    name,
    location,
    format,
    length: 0,
    context: gl,
    program: glProgram,
    set(data, transpose = false) {
      let arrayBuffer;
      if (data == null) {
        return result;
      } else if (data instanceof result.format.source) {
        arrayBuffer = data;
      } else if (data.data != null) {
        arrayBuffer = data.data;
      } else if (Array.isArray(data)) {
        const flat = [];
        for (const entry of data) {
          if (typeof entry === "number") {
            flat.push(entry);
          } else if (typeof entry.toArray === "function") {
            flat.push(...entry.toArray().slice(0, result.format.size));
          } else if (entry[Symbol.iterator] != null) {
            flat.push(...[...entry].slice(0, result.format.size));
          }
        }
        arrayBuffer = new result.format.source(flat);
      } else {
        throw new Error("invalid uniform data", {
          cause: {
            dataType: typeof data,
            data,
          },
        });
      }
      result.data = arrayBuffer;
      result.length = baseLength;
      result.format.glSetUniform(
        result.context,
        result.location,
        arrayBuffer,
        transpose
      );
      return result;
    },
    clear() {
      result.format.glSetUniform(result.context, result.location, I, false);
      return result;
    },
    forContext(gl, program = undefined) {
      const result2 = uniform(
        gl,
        result.name,
        result.format,
        program || gl.program
      );
      result2.set(result.data);
      return result2;
    },
  };
  result.clear();
  return result;
}

function animation(frame, autostart = true) {
  const result = {
    frame,
  };
  result.lastFrame = performance.now();
  result.running = autostart;
  result.step = () => {
    const timeNow = performance.now();
    const deltaT = timeNow - result.lastFrame;
    result.frame(deltaT);
    result.lastFrame = timeNow;
    if (result.running) requestAnimationFrame(result.step);
    return deltaT;
  };
  if (result.running) requestAnimationFrame(result.step);
  result.start = () => {
    result.running = true;
    result.lastFrame = performance.now();
    requestAnimationFrame(result.step);
    return result;
  };
  result.stop = () => {
    result.running = false;
    return result;
  };
  return result;
}
