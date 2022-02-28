// 扩展ts定义的类型。
declare global {
    interface WebGLRenderingContext {
        program: WebGLProgram;
    }
}

/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
export function initShaders(gl: WebGLRenderingContext | undefined, vshader: string, fshader: string) {
    if (!gl) {
        return;
    }
    let program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }

    gl.useProgram(program);
    gl.program = program;
    return true;
}

export function initVertexBuffers(gl: WebGLRenderingContext) {
    let vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ]);
    // 点的个数
    let n = 3;

    // step1 创建缓冲区对象
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error('create buffer error');
        return -1;
    }
    // step2 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //step3 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //step4 将缓冲区分配给attribute变量，这个2指两个点是一个坐标
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // step5 开启attribute变量。
    gl.enableVertexAttribArray(a_Position);
    return n;

}

/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl: WebGLRenderingContext, vshader: string, fshader: string) {
    // Create shader object
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    let program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        let error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl: WebGLRenderingContext, type: any, source: string) {
    // Create shader object
    let shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        console.error('Failed to compile shader: ' + error);
        console.log('shader source: ', source);

        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


