import type { NextPage } from 'next';
import React, { useRef } from 'react';
import { initShaders, initVertexBuffers } from '@/utils/shader_util';
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

    // 创建Matrix4对象来进行模型变换
    const modelMatrix = new Matrix4();
    // 设置模型矩阵为旋转矩阵
    const angle = 60.0;
    const Tx = 0.5;
    modelMatrix.setRotate(angle, 0.0, 0.0, 1);
    modelMatrix.translate(Tx, 0, 0);

    // modelMatrix.setTranslate(Tx,0,0);
    // modelMatrix.rotate(angle, 0.0, 0.0, 1);

    //
    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);

    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    //绘制点
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // }, [gl]);

}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    useRender(gl);
    return (
        <Layout title={'TranslateRotate'}>
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
