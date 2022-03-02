// 扩展ts定义的类型。
import { func } from 'prop-types';

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

export function cratePointSizeBuffer(gl: WebGLRenderingContext) {
    // 创建点尺寸buffer
    const sizes = new Float32Array([10.0, 20.0, 30.0]);
    const sizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);
}

// ch5
export function initVertexBuffersCh5(gl: WebGLRenderingContext) {
    // 同时保存顶点坐标和大小
    const verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0,
    ]);
    let n = 3;
    // step1 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    // step2 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    //step3 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);
    //step4 将缓冲区分配给attribute变量，这个2指两个点是一个坐标
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    // 重点在这里！！！
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);
    // step5 开启attribute变量。
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_PointSize);
    return n;
}

// ch5
export function initVertexBuffersCh5_2(gl: WebGLRenderingContext) {
    // 同时保存顶点坐标和颜色
    const verticesColors = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);
    let n = 3;
    // step1 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    // step2 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    //step3 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    //step4 将缓冲区分配给attribute变量，这个2指两个点是一个坐标
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // 重点在这里！！！
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    // step5 开启attribute变量。
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    return n;
}

export function initVertexBuffersCh5_3(gl: WebGLRenderingContext) {
    // 同时保存顶点坐标纹理坐标
    const verticesCoords = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ]);
    let n = 4;
    // step1 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    const coordBuffer = gl.createBuffer();
    // step2 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
    //step3 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesCoords, gl.STATIC_DRAW);
    //step4 将缓冲区分配给attribute变量，这个2指两个点是一个坐标
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    const FSIZE = verticesCoords.BYTES_PER_ELEMENT;
    // 重点在这里！！！
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    // step5 开启attribute变量。
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;
}

export function initTextures(gl: WebGLRenderingContext, n: number) {
    // 创建纹理对象
    const texture = gl.createTexture()!;
    // 获取uniform存储位置
    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler')!;

    const image = new Image();
    image.onload = () => {
        // 图像加载完成处理纹理
        loadTexture(gl, n, texture, u_Sampler, image);
    };
    image.src = '/images/sky.jpg';
}

function loadTexture(gl: WebGLRenderingContext, n: number,
    texture: WebGLTexture, u_Sampler: WebGLUniformLocation, image: HTMLImageElement) {
    //对纹理图像y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // 将0号纹理传给着色器
    gl.uniform1i(u_Sampler, 0);
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

export function initVertexBuffersCh7_1(gl: WebGLRenderingContext) {
    // 同时保存顶点坐标纹理坐标
    const verticesColors = new Float32Array([
        // 顶点坐标和颜色
        //绿色三角形在最后面
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
        //黄色三角形在最中间
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
        //蓝色三角形在最前面
        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);
    let n = 9;

    // step1 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    // step2 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    //step3 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    //step4 将缓冲区分配给attribute变量，这个2指两个点是一个坐标
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    const FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // 重点在这里！！！
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    // step5 开启attribute变量。
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    return n;
}

