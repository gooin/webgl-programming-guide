import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { initShaders, initVertexBuffersCh7_1 } from '@/utils/shader_util';
import { useWebGLInit } from '@/hooks/index';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import { Typography } from 'antd';
import { func } from 'prop-types';

const { Text } = Typography;

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    const [near, setNear] = useState<number>(0);
    const [far, setFar] = useState<number>(0.5);

    useEffect(() => {
        if (!gl) return;
        const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            uniform mat4 u_ProjMatrix;
            varying vec4 v_Color;
            void main() {
                gl_Position = u_ProjMatrix *  a_Position;
                gl_PointSize = 10.0;
                v_Color = a_Color;
            }
        `;
        const FSHADER_SOURCE = ` 
        precision mediump float; 
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
        }
        `;

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
        const n = initVertexBuffersCh7_1(gl);

        // 可视空间投影矩阵
        const projMatrix = new Matrix4();
        projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, near,far);

        const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

        document.onkeydown = (ev) => {
            const { keyCode } = ev;

            switch (keyCode) {
                case 38:
                    setNear(near + 0.01);
                    break;
                case 40:
                    setNear(near - 0.01);
                    break;
                case 37:
                    setFar(far + 0.01);
                    break;
                case 39:
                    setFar(far - 0.01);
                    break;
                default:
                    break;
            }

            // 清空canvas
            gl.clear(gl.COLOR_BUFFER_BIT);
            //绘制点
            gl.drawArrays(gl.TRIANGLES, 0, n);

            return [near,far];
        };

        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // 清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, [gl, near,far]);

    return [near,far];
}
const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const [near,far] = useRender(gl);
    return (
        <Layout title={'正射投影'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <CanvasWrapper>
                <Text mark>按方向键【上】【下】【左】【右】调整远近</Text>
                <Text mark>near: {near}</Text>
                <Text mark>far: {far}</Text>
                <canvas id={'webgl'} ref={canvasRef}/>
            </CanvasWrapper>

        </Layout>

    );
};
export default Index;
