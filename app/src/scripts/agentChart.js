import { mat4 } from 'gl-matrix';

// Vector shader source code
const vSource = `
    attribute vec4 aVertexColor;
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform float uPointSize;
    varying lowp vec4 vColor;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      gl_PointSize = uPointSize;
      vColor = aVertexColor;
    }
  `;

// Fragment shader source code
const fSource = `
  varying lowp vec4 vColor;
  void main() {
    gl_FragColor = vColor;
  }
`;

// Creates, loads and compiles a shader with a given type
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);   // Create empty shader of the given type 
  gl.shaderSource(shader, source);        // Load the source into the shader
  gl.compileShader(shader);               // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
    alert(`Error compiling shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;                          // Return the compiled shader
}

// This function loads the shader program, the program incorporates both shaders.
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    gl.deleteProgram(shaderProgram);
    return null;
  }

  return shaderProgram;
}

// Represents the webgl canvas we'll use to draw the agents.
export default class AgentChart {
  constructor(gl) {
    this.gl = gl;

    // Load and compile the shader program from source
    const shaderProgram = initShaderProgram(gl, vSource, fSource);

    // Collect all the info needed to use the shader program.
    // Obtains references to the different locations of the attributes in the program.
    this.programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(
          shaderProgram, 'uProjectionMatrix'
        ),
        modelViewMatrix: gl.getUniformLocation(
          shaderProgram, 'uModelViewMatrix'
        ),
        pointSize: gl.getUniformLocation(
          shaderProgram, 'uPointSize'
        )
      },
    };
  }

  // This function draws the agents based on the drawInfo that is included.
  // For n agents:
  // Expects positions as an array like this: [X0, Y0, X1, Y1..... Xn, Yn].
  // Expects colors in the same fashion: [R0, G0, B0, A0, R1, G1, B1, A1... Rn, Gn, Bn, An].
  draw(drawinfo){
    const buffers = this.initBuffers(drawinfo.pos, drawinfo.col);
    this.drawScene(buffers, drawinfo.count, drawinfo.size);
  }

  // This function is responsible for binding the incoming data to the actual gl buffers used for drawing.
  initBuffers(positions, colors) {
    const positionBuffer =  this.initGlBuffer(positions); // Get a gl buffer for the positions
    const colorBuffer =     this.initGlBuffer(colors);    // Get a gl buffer for the colors
    return {
      position: positionBuffer,
      color: colorBuffer,
    };
  }
  
  initGlBuffer(data) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(data),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  // This function is responsible for drawing the scene using the buffers.
  drawScene(buffers, count, pointSize) {
    this.gl.clearColor(0.8, 0.8, 0.8, 1.0);   // Set background color
    this.gl.clearDepth(1.0);                  // Clear everything
    this.gl.enable(this.gl.DEPTH_TEST);       // Enable depth testing
    this.gl.depthFunc(this.gl.LEQUAL);        // Near things obscure far things
  
    // Clear the canvas before we start drawing on it
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  
    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 1000 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000.0;
    const projectionMatrix = mat4.create();
  
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();
  
    // Make sure we actually do center the thing or we wont see what's happening.
    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [-this.gl.canvas.clientWidth/2, -this.gl.canvas.clientHeight/2, -750.0] 
      // The -750 is a magic number, it controls the amount of zooming. Not sure what to base it on.
    );
  
    // In the next bit we're binding the buffers to where they should be bound.
    // Positions
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexPosition,
      2,                // Pull out 2 values per iteration
      this.gl.FLOAT,    // The data in the buffer is 32bit floats
      false,            // Do not normalize the data
      0,                // how many bytes to get from one set of values to the next (stride)
      0                 // how many bytes inside the buffer to start from (offset)
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
    
    // Color
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
    this.gl.vertexAttribPointer(
      this.programInfo.attribLocations.vertexColor,
      4,                // Pull out 4 values per iteration
      this.gl.FLOAT,    // The data in the buffer is 32bit floats
      false,            // Do not normalize the data
      0,                // how many bytes to get from one set of values to the next (stride)
      0                 // how many bytes inside the buffer to start from (offset)
    );
    this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
  
    // Tell WebGL to use our program when drawing
    this.gl.useProgram(this.programInfo.program);
  
    // Set the shader uniforms
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix
    );
    this.gl.uniform1f(
      this.programInfo.uniformLocations.pointSize,
      pointSize
    );

    // Then finally do the actual drawing
    {
      const offset = 0;
      const vertexCount = count;
      this.gl.drawArrays(this.gl.POINTS, offset, vertexCount);
    }
  }
}



