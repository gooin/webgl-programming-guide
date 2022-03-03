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
    const [viewX, setViewX] = useState<number>(0.2);

    useEffect(() => {
        if (!gl) return;
        const VSHADER_SOURCE = `
            attribute vec4 a_Position;
            attribute vec4 a_Color;
            uniform mat4 u_ModelViewMatrix;
            varying vec4 v_Color;
            void main() {
                gl_Position = u_ModelViewMatrix *  a_Position;
                gl_PointSize = 10.0;
                v_Color = a_Color;
            }
        `;
        const FSHADER_SOURCE = ` 
        // 指定精度，书上的例子会编译报错， 参考 https://stackoverflow.com/a/27067272
        precision mediump float; 
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color;
        }
        `;

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
        const n = initVertexBuffersCh7_1(gl);

        // 视图矩阵
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt(
            viewX, 0.25, 0.25,
            0, 0, 0,
            0, 1, 0,
        );
        //模型矩阵
        const modelMatrix = new Matrix4();
        modelMatrix.setRotate(10, 0, 0, 1);

        //模型视图矩阵 两个矩阵相乘
        const viewModelMatrix = viewMatrix.multiply(modelMatrix);

        // 投影矩阵，透视投影，修复被擦掉的一角
        const projMatrix = new Matrix4();
        projMatrix.setOrtho(-1,1,-1,1,0,2)

        const finalMatrix = projMatrix.multiply(viewModelMatrix);
        const u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');

        // 将矩阵传给uniform变量
        gl.uniformMatrix4fv(u_ModelViewMatrix, false, finalMatrix.elements);

        let g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25;
        document.onkeydown = (ev) => {
            const { keyCode } = ev;
            //右键
            if (keyCode === 38) {
                g_eyeX += 0.01;
                setViewX(viewX + 0.01);
            } else if (keyCode === 40) {
                g_eyeX -= 0.01;
                setViewX(viewX - 0.01);
            } else {
                return;
            }
            return [viewX];
        };

        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }
        // 清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, [gl, viewX]);

    return [viewX];
    // });
}
const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    const [viewX] = useRender(gl);
    return (
        <Layout title={'视点和视线'}>
            <MdxWrapper>
                <Note/>
            </MdxWrapper>
            <CanvasWrapper>
                <Text mark>按方向键【上】【下】旋转视角</Text>
                <Text mark>当前 viewMatrix eyeX： {viewX}</Text>
                <canvas id={'webgl'} ref={canvasRef}/>
            </CanvasWrapper>

        </Layout>

    );
};
export default Index;
