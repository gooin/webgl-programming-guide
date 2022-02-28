import type { NextPage } from 'next';
import React, { useRef } from 'react';
import styles from '../styles/Home.module.css';
import { useWebGLInit } from '../hooks';
import { initShaders } from '../utils/shader_util';
import Layout from '../components/Layout';
import { resizeCanvasToDisplaySize } from '../utils/common_util';

// @ts-ignore
// import VSHADER_SOURCE  from '../shaders/vert/ch2_point.vert';

function render(gl: WebGLRenderingContext) {
    console.log('rendergl', gl);

    if (!gl) return;
    const VSHADER_SOURCE = `
    void main() {
        gl_Position = vec4(0.0,0.0,0.0,1.0);
        gl_PointSize = 10.0;
    }
    `;
    const FSHADER_SOURCE = `
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        }
        `;

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
}

const Hello: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    render(gl);
    return (
        <Layout title={'Hello'}>
            <canvas id={'webgl'} ref={canvasRef}/>
        </Layout>

    );
};
export default Hello;
