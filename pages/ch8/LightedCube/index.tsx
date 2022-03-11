import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { initShaders, initVertexBuffersCube_Ch8_1 } from '@/utils/shader_util';
import { useWebGLInit } from '@/utils/hooks';
import Layout from '@/components/Layout';
import { Matrix4, Vector3 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import VSHADER_SOURCE from '@/shaders/vert/ch8_s1.vert';
import { Typography } from 'antd';

const { Text } = Typography;

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    const [near, setNear] = useState<number>(3);
    const [far, setFar] = useState<number>(3);

    useEffect(() => {
        if (!gl) return;
        const FSHADER_SOURCE = ` 
        precision mediump float; 
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
        }
        `;

        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

        const n = initVertexBuffersCube_Ch8_1(gl);

        const mvpMatrix = new Matrix4();
        mvpMatrix.setPerspective(30, 1, 1, 100);
        mvpMatrix.lookAt(near, far, 7, 0, 0, 0, 0, 1, 0);
        const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);


        const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        const lightDirection = new Vector3([0.5, 3.0, 4.0]);
        lightDirection.normalize();

        gl.uniform3fv(u_LightDirection, lightDirection.elements);

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

            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

            return [near, far];
        };

        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // 清空canvas
        // gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        // gl.drawArrays(gl.TRIANGLES, 0, n);
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }, [gl, near, far]);

    return [near, far];
}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const [near, far] = useRender(gl);
    return (
        <Layout title={'光照'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <CanvasWrapper>
                <Text mark>上下左右调整视角</Text>
                <Text>eyeX: {near}</Text>
                <Text>eyeY: {far}</Text>
                <canvas id={'webgl'} ref={canvasRef}/>
            </CanvasWrapper>

        </Layout>

    );
};
export default Index;
