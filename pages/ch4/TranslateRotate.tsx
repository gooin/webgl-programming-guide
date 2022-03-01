import type { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import { initShaders, initVertexBuffers } from '@/utils/shader_util';
import { useWebGLInit } from '../../hooks';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';

function useRender(gl: WebGLRenderingContext) {
    console.log('rendergl', gl);
    useEffect(() => {
        if (!gl) return;
        const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            uniform mat4 u_xformMatrix;
            void main() {
                gl_Position = u_xformMatrix * a_Position;
            }
    `;
        const FSHADER_SOURCE = `
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        }
        `;

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
        const n = initVertexBuffers(gl);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }

        // 新建一个矩阵
        const xformMatrix = new Matrix4();
        // 设置旋转
        xformMatrix.setRotate(90.0, 0.0, 0.0, 1.0);

        const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

        gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        // 清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, [gl]);

}

const TranslateRotate: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    useRender(gl);
    return (
        <Layout title={'TranslateRotate'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <canvas id={'webgl'} ref={canvasRef}/>
        </Layout>

    );
};
export default TranslateRotate;
