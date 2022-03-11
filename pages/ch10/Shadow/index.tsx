// @ts-nocheck
import type { NextPage } from 'next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { initShaders, initVertexBuffersCh9_1 } from '@/utils/shader_util';
import { useWebGLInit } from '@/utils/hooks';
import {
    createProgram,
    initFramebufferObject,
    initVertexBuffersCh10_1_plane,
    initVertexBuffersCh10_1_triangle,
} from '@/utils/shader_util';
import { useWebGLInit } from '@/hooks/index';
import Layout from '@/components/Layout';
import { Matrix4 } from '@/utils/matrix4_util';
import Note from './Note.mdx';
import MdxWrapper from '@/components/MdxWrapper';
import CanvasWrapper from '@/components/CanvasWrapper';
import VSHADER_SOURCE from '@/shaders/vert/ch10_s1.vert';
import FSHADER_SOURCE from '@/shaders/frag/ch10_s1.frag';
import VSHADER_SHADOW_SOURCE from '@/shaders/vert/ch10_s1_shadow.vert';
import FSHADER_SHADOW_SOURCE from '@/shaders/frag/ch10_s1_shadow.frag';
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

    const OFFSCREEN_WIDTH = 2048, OFFSCREEN_HEIGHT = 2048;
    const LIGHT_X = 0, LIGHT_Y = 7, LIGHT_Z = 2; // Position of the light source

    useEffect(() => {
        if (!gl) return;
        if (isInit) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const shadowProgram = createProgram(gl, VSHADER_SHADOW_SOURCE, FSHADER_SHADOW_SOURCE) as WebGLProgram;
        shadowProgram.a_Position = gl.getAttribLocation(shadowProgram, 'a_Position');
        shadowProgram.u_MvpMatrix = gl.getAttribLocation(shadowProgram, 'u_MvpMatrix');
        if (shadowProgram.a_Position < 0 || !shadowProgram.u_MvpMatrix) {
            console.log('Failed to get the storage location of attribute or uniform variable from shadowProgram');
            return;
        }

        const normalProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
        normalProgram.a_Position = gl.getAttribLocation(normalProgram, 'a_Position');
        normalProgram.a_Color = gl.getAttribLocation(normalProgram, 'a_Color');
        normalProgram.u_MvpMatrix = gl.getUniformLocation(normalProgram, 'u_MvpMatrix');
        normalProgram.u_MvpMatrixFromLight = gl.getUniformLocation(normalProgram, 'u_MvpMatrixFromLight');
        normalProgram.u_ShadowMap = gl.getUniformLocation(normalProgram, 'u_ShadowMap');
        if (normalProgram.a_Position < 0 || normalProgram.a_Color < 0 || !normalProgram.u_MvpMatrix ||
            !normalProgram.u_MvpMatrixFromLight || !normalProgram.u_ShadowMap) {
            console.log('Failed to get the storage location of attribute or uniform variable from normalProgram');
            return;
        }

        const plane = initVertexBuffersCh10_1_plane(gl);
        const triangle = initVertexBuffersCh10_1_triangle(gl);

        const fbo = initFramebufferObject(gl);
        if (!fbo) {
            console.log('Failed to initialize frame buffer object');
            return;
        }

        gl.activeTexture(gl.TEXTURE0); // Set a texture object to the texture unit
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture);

        // Set the clear color and enable the depth test
        gl.clearColor(0, 0, 0, 1);
        gl.enable(gl.DEPTH_TEST);

        const viewProjMatrixFromLight = new Matrix4(); // Prepare a view projection matrix for generating a shadow map
        viewProjMatrixFromLight.setPerspective(70.0, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1.0, 100.0);
        viewProjMatrixFromLight.lookAt(LIGHT_X, LIGHT_Y, LIGHT_Z, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

        const viewProjMatrix = new Matrix4();          // Prepare a view projection matrix for regular drawing
        viewProjMatrix.setPerspective(45, 1, 1.0, 100.0);
        viewProjMatrix.lookAt(0.0, 7.0, 9.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

        const currentAngle = 0.0; // Current rotation angle (degrees)
        const mvpMatrixFromLight_t = new Matrix4(); // A model view projection matrix from light source (for triangle)
        const mvpMatrixFromLight_p = new Matrix4(); // A model view projection matrix from light source (for plane)
        const tick = function () {
            currentAngle = animate(currentAngle);

            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);               // Change the drawing destination to FBO
            gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT); // Set view port for FBO
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);   // Clear FBO

            gl.useProgram(shadowProgram); // Set shaders for generating a shadow map
            // Draw the triangle and the plane (for generating a shadow map)
            drawTriangle(gl, shadowProgram, triangle, currentAngle, viewProjMatrixFromLight);
            mvpMatrixFromLight_t.set(g_mvpMatrix); // Used later
            drawPlane(gl, shadowProgram, plane, viewProjMatrixFromLight);
            mvpMatrixFromLight_p.set(g_mvpMatrix); // Used later

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);               // Change the drawing destination to color buffer
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    // Clear color and depth buffer

            gl.useProgram(normalProgram); // Set the shader for regular drawing
            gl.uniform1i(normalProgram.u_ShadowMap, 0);  // Pass 0 because gl.TEXTURE0 is enabledする
            // Draw the triangle and plane ( for regular drawing)
            gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_t.elements);
            drawTriangle(gl, normalProgram, triangle, currentAngle, viewProjMatrix);
            gl.uniformMatrix4fv(normalProgram.u_MvpMatrixFromLight, false, mvpMatrixFromLight_p.elements);
            drawPlane(gl, normalProgram, plane, viewProjMatrix);

            window.requestAnimationFrame(tick, canvas);
        };

        // Coordinate transformation matrix
        var g_modelMatrix = new Matrix4();
        var g_mvpMatrix = new Matrix4();

        function drawTriangle(gl, program, triangle, angle, viewProjMatrix) {
            // Set rotate angle to model matrix and draw triangle
            g_modelMatrix.setRotate(angle, 0, 1, 0);
            draw(gl, program, triangle, viewProjMatrix);
        }

        function drawPlane(gl, program, plane, viewProjMatrix) {
            // Set rotate angle to model matrix and draw plane
            g_modelMatrix.setRotate(-45, 0, 1, 1);
            draw(gl, program, plane, viewProjMatrix);
        }

        function draw(gl, program, o, viewProjMatrix) {
            initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
            if (program.a_Color != undefined) // If a_Color is defined to attribute
                initAttributeVariable(gl, program.a_Color, o.colorBuffer);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

            // Calculate the model view project matrix and pass it to u_MvpMatrix
            g_mvpMatrix.set(viewProjMatrix);
            g_mvpMatrix.multiply(g_modelMatrix);
            gl.uniformMatrix4fv(program.u_MvpMatrix, false, g_mvpMatrix.elements);

            gl.drawElements(gl.TRIANGLES, o.numIndices, gl.UNSIGNED_BYTE, 0);
        }

        // Assign the buffer objects and enable the assignment
        function initAttributeVariable(gl, a_attribute, buffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
            gl.enableVertexAttribArray(a_attribute);
        }

        var ANGLE_STEP = 40;   // The increments of rotation angle (degrees)

        var last = Date.now(); // Last time that this function was called
        function animate(angle) {
            var now = Date.now();   // Calculate the elapsed time
            var elapsed = now - last;
            last = now;
            // Update the current rotation angle (adjusted by the elapsed time)
            var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
            return newAngle % 360;
        }

        tick();

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
