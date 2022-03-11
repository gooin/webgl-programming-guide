import type { NextPage } from 'next';
import React, { useRef } from 'react';
import { initShaders, initVertexBuffersCh5 } from '@/utils/shader_util';
import { useWebGLInit } from '@/utils/hooks';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    // useEffect(() => {
    if (!gl) return;
    const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute float a_PointSize;
            uniform mat4 u_xformMatrix;
            void main() {
                gl_Position = u_xformMatrix * a_Position;
                gl_PointSize = a_PointSize;
            }
    `;
    const FSHADER_SOURCE = `
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
        }
        `;

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    const n = initVertexBuffersCh5(gl);

    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // 创建Matrix4对象来进行模型变换
    const modelMatrix = new Matrix4();
    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制点
    gl.drawArrays(gl.POINTS, 0, n);
    // }, [gl]);

}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    useRender(gl);
    return (
        <Layout title={'gl.vertexAttribPointer() 的步进和偏移参数'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <CanvasWrapper>
                <canvas id={'webgl'} ref={canvasRef}/>
            </CanvasWrapper>

        </Layout>

    );
};
export default Index;
