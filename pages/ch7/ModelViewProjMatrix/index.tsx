import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import {
    initShaders,
    initVertexBuffersCh7_1,
    initVertexBuffersCh8_1,
    initVertexBuffersCh8_2,
} from '@/utils/shader_util';
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
    const [near, setNear] = useState<number>(1);
    const [far, setFar] = useState<number>(100);

    useEffect(() => {
        if (!gl) return;
        const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            uniform mat4 u_ProjMatrix;
            uniform mat4 u_ViewMatrix;
            uniform mat4 u_ModelMatrix;
            varying vec4 v_Color;
            void main() {
                gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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
        const n = initVertexBuffersCh8_2(gl);
        const viewMatrix = new Matrix4();
        const projMatrix = new Matrix4();
        const modelMatrix = new Matrix4();
        const mvpMatrix = new Matrix4();

        // 绘制右侧三角形
        modelMatrix.setTranslate(0.75, 0, 0);
        viewMatrix.setLookAt(
            0, 0, 5,
            0, 0, -100,
            0, 1, 0
        );
        projMatrix.setPerspective(30, 1, near, far);

        // @ts-ignore
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

        const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
        const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, n);

        // 绘制左侧三角形
        modelMatrix.setTranslate(-0.75, 0, 0);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        gl.drawArrays(gl.TRIANGLES, 0, n);

        document.onkeydown = (ev) => {
            const { keyCode } = ev;

            switch (keyCode) {
                case 38:
                    setNear(near + 1);
                    break;
                case 40:
                    setNear(near - 1);
                    break;
                case 37:
                    setFar(far + 1);
                    break;
                case 39:
                    setFar(far - 1);
                    break;
                default:
                    break;
            }

            // // 清空canvas
            // gl.clear(gl.COLOR_BUFFER_BIT);
            // //绘制点
            // gl.drawArrays(gl.TRIANGLES, 0, n);

            return [near,far];
        };

        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // 清空canvas
        // gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        // gl.drawArrays(gl.TRIANGLES, 0, n);
    }, [gl, near,far]);

    return [near,far];
}
const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const [near,far] = useRender(gl);
    return (
        <Layout title={'模型矩阵、视图矩阵、投影矩阵组合'}>
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
