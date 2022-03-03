import type { NextPage } from 'next';
import React, { useRef } from 'react';
import { initShaders, initTextures_Ch5_4, initVertexBuffersCh5_4 } from '@/utils/shader_util';
import { useWebGLInit } from '@/hooks/index';
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
            attribute vec2 a_TexCoord;
            varying vec2 v_TexCoord;
            void main() {
                gl_Position = a_Position;
                gl_PointSize = 10.0;
                v_TexCoord = a_TexCoord;
            }
    `;
    const FSHADER_SOURCE = `
        // 指定精度，书上的例子会编译报错， 参考 https://stackoverflow.com/a/27067272
        precision mediump float; 
        varying vec4 v_Color;
        uniform sampler2D u_Sampler0;
        uniform sampler2D u_Sampler1;
        varying vec2 v_TexCoord;
        void main() {
            vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
            vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
            gl_FragColor = color0 * color1;
        }
        `;

    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    const n = initVertexBuffersCh5_4(gl);
    initTextures_Ch5_4(gl, n);

    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // }, [gl]);

}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    useRender(gl);
    return (
        <Layout title={'多幅纹理映射'}>
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
