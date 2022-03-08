import type { NextPage } from 'next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { initShaders, initVertexBuffersCh9_1 } from '@/utils/shader_util';
import { useWebGLInit } from '@/hooks/index';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import VSHADER_SOURCE from '@/shaders/vert/ch9_s1.vert';
import FSHADER_SOURCE from '@/shaders/frag/ch9_s1.frag';
import { Typography } from 'antd';

const { Text } = Typography;

interface KeyboardPropsType {
    gl: WebGLRenderingContext,
    n: number,
    mvpMatrix: Matrix4
}

function useRender(gl: WebGLRenderingContext) {
    // console.log('useRender gl', gl);
    const [n, setN] = useState(0);
    const mvpMatrix = useMemo(() => new Matrix4(), []);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        if (!gl) return;
        if (isInit) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

        const tempN = initVertexBuffersCh9_1(gl);
        setN(tempN);

        console.log('mvpMatrix', mvpMatrix);

        const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
        const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
        const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
        const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
        const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
        const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
        if (!u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition || !u_AmbientLight) {
            console.log('Failed to get the storage location');
            console.log(u_ModelMatrix, u_NormalMatrix, u_LightColor, u_LightPosition, u_AmbientLight);

            return;
        }

        gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
        gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
        // Set the light direction (in the world coordinate)
        gl.uniform3f(u_LightPosition, 20, 20.0, 20);

        // const mvpMatrix = new Matrix4();
        const modelMatrix = new Matrix4(); // 模型矩阵
        const normalMatrix = new Matrix4(); // 变换法向量的矩阵
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose();

        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        mvpMatrix.setPerspective(50, 1, 1, 100);
        mvpMatrix.lookAt(20, 10, 30, 0, 0, 0, 0, 1, 0);
        mvpMatrix.multiply(modelMatrix);

        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // 清空canvas
        // gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        // gl.drawArrays(gl.TRIANGLES, 0, n);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //
        // // Draw the cube
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        setIsInit(true);
    }, [gl, n, mvpMatrix, isInit]);

    return {
        gl,
        n,
        mvpMatrix,
    };
}

function useKeyboard(props: KeyboardPropsType) {
    const {
        gl,
        n,
        mvpMatrix,
    } = props;
    const ANGLE_STEP = 3;

    const [arm1Angle, setArm1Angle] = useState(90);
    const [joint1Angle, setJoint1Angle] = useState(0);

    const g_modelMatrix = useMemo(() => new Matrix4(), []);
    const g_mvpMatrix = useMemo(() => new Matrix4(), []);
    const g_normalMatrix = useMemo(() => new Matrix4(), []);

    useEffect(() => {
        document.onkeydown = (ev) => {
            const { keyCode } = ev;

            switch (keyCode) {
                //    up
            case 38:
                if (joint1Angle < 135) {
                    setJoint1Angle(joint1Angle + ANGLE_STEP);
                }
                break;
                //    down
            case 40:
                if (joint1Angle > -135) {
                    setJoint1Angle(joint1Angle - ANGLE_STEP);
                }
                break;
                //    left
            case 37:
                setArm1Angle((arm1Angle + ANGLE_STEP) % 360);
                break;
            case 39:
                // right
                setArm1Angle((arm1Angle - ANGLE_STEP) % 360);
                break;
            default:
                return;
            }

            // arm1 绘制底座
            const arm1Length = 10.0;
            g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
            g_modelMatrix.rotate(arm1Angle, 0.0, 1.0, 0.0);
            drawBox(gl, n, mvpMatrix);

            // arm2
            g_modelMatrix.translate(0.0, arm1Length, 0.0);
            g_modelMatrix.rotate(joint1Angle, 0.0, 0.0, 1.0);
            g_modelMatrix.scale(1.3, 1.0, 1.3); // Make it a little thicker
            drawBox(gl, n, mvpMatrix);

        };

        function drawBox(gl: WebGLRenderingContext, n: number, viewProjMatrix: Matrix4) {
            const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
            const u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
            g_mvpMatrix.set(viewProjMatrix);
            g_mvpMatrix.multiply(g_modelMatrix);
            gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);

            // Calculate the normal transformation matrix and pass it to u_NormalMatrix
            g_normalMatrix.setInverseOf(g_modelMatrix);
            g_normalMatrix.transpose();
            gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

            gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        }

        // console.log('draw');
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
        // document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'left'}));
    }, [arm1Angle, g_modelMatrix, g_mvpMatrix, g_normalMatrix, gl, joint1Angle, mvpMatrix, n, setArm1Angle, setJoint1Angle]);

}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const props = useRender(gl);
    useKeyboard(props);
    return (
        <Layout title={'阴影'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <CanvasWrapper>
                <Text mark>上下左右调整视角</Text>
                {/*<Text>eyeX: {near}</Text>*/}
                {/*<Text>eyeY: {far}</Text>*/}
                <canvas id={'webgl'} ref={canvasRef}/>
            </CanvasWrapper>

        </Layout>

    );
};
export default Index;
