import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import {
    initShaders,
    initVertexBuffersCube,
    initVertexBuffersCube_Ch8_1,
    initVertexBuffersCube_Ch8_2,
} from '@/utils/shader_util';
import { useWebGLInit } from '@/hooks/index';
import Layout from '@/components/Layout';
import { Matrix4, Vector3 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import VSHADER_SOURCE from '@/shaders/vert/ch8_s5.vert';
import FSHADER_SOURCE from '@/shaders/frag/ch8_s5.frag';
import { Typography } from 'antd';

const { Text } = Typography;

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    const [near, setNear] = useState<number>(6);
    const [far, setFar] = useState<number>(6);

    useEffect(() => {
        if (!gl) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

        const n = initVertexBuffersCube_Ch8_2(gl);


        const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
        const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
        const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
        const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
        if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) {
            console.log('Failed to get the storage location');
            console.log(u_ModelMatrix, u_NormalMatrix, u_LightColor, u_LightPosition, u_AmbientLight);

            return;
        }

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.2,0.2, 0.2);
        // Set the light direction (in the world coordinate)
        gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);

        const mvpMatrix = new Matrix4();
        const modelMatrix = new Matrix4(); // 模型矩阵
        const normalMatrix = new Matrix4(); // 变换法向量的矩阵


        // Calculate the model matrix
        modelMatrix.rotate(90, 0, 1, 0);     // Rotate 90 degree around the z-axis
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);


        // Calculate the matrix to transform the normal based on the model matrix
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();

        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);


        mvpMatrix.setPerspective(30, 1, 1, 100);
        mvpMatrix.lookAt(near, far, 14, 0, 0, 0, 0, 1, 0);
        mvpMatrix.multiply(modelMatrix);

        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);



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

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Draw the cube
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
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw the cube
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    }, [gl, near, far]);

    return [near, far];
}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const [near, far] = useRender(gl);
    return (
        <Layout title={'点光源光: 逐片元光照'}>
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
