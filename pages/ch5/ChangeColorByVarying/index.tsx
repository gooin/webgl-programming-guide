import type { NextPage } from 'next';
import React, { useRef } from 'react';
import { initShaders, initVertexBuffersCh5_2 } from '@/utils/shader_util';
import { useWebGLInit } from '@/utils/hooks';
import Layout from '@/components/Layout';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    // useEffect(() => {
    if (!gl) return;
    const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            // varying变量
            varying vec4 v_Color;
            void main() {
                gl_Position = a_Position;
                gl_PointSize = 10.0;
                // 将颜色传给片元着色器
                v_Color = a_Color;
            }
    `;
    const FSHADER_SOURCE = `
        // 指定精度，书上的例子会编译报错， 参考 https://stackoverflow.com/a/27067272
        precision mediump float; 
        varying vec4 v_Color;
        void main() {
            gl_FragColor = vec4(1.0,1.0,0.0,1.0);
            gl_FragColor = v_Color;
        }
        `;

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    const n = initVertexBuffersCh5_2(gl);

    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }


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
        <Layout title={'修改颜色 varying变量'}>
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
