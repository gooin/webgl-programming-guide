import type { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import { initShaders, initVertexBuffers } from '@/utils/shader_util';
import { useWebGLInit } from '@/utils/hooks';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import _ from 'lodash';

function useRender(gl: WebGLRenderingContext) {
    console.log('useRender gl', gl);
    useEffect(() => {
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

        const ANGLE_STEP = 30.0; // The increments of rotation angle (degrees)
        let currentAngle = 0.0; // Current rotation angle (degrees)
        // 创建Matrix4对象来进行模型变换
        const modelMatrix = new Matrix4();

        const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

        const tick = _.debounce(() => {
            currentAngle = animate(currentAngle); // Update the rotation angle
            draw(gl, n, currentAngle); // Draw the triangle
            // 告诉浏览器调用tick函数
            requestAnimationFrame(tick); // Request that the browser ?calls tick
        }, 50);

        tick();

        function draw(gl: WebGLRenderingContext, n: number, currentAngle: number) {
            // 设置旋转矩阵
            modelMatrix.setRotate(currentAngle, 0, 0, 1);
            modelMatrix.translate(0.3, 0, 0);
            gl.uniformMatrix4fv(u_xformMatrix, false, modelMatrix.elements);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, n);
        }

        let last = Date.now();

        function animate(angle: number) {
            let now = Date.now();
            let elapsed = now - last;
            last = now;
            let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
            return newAngle %= 360;
        }

        // 清空canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
        //绘制点
        gl.drawArrays(gl.TRIANGLES, 0, n);
    }, [gl]);

}

const Index: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const gl = useWebGLInit(canvasRef) as WebGLRenderingContext;
    useRender(gl);
    return (
        <Layout title={'动画'}>
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
