import { resizeCanvasToDisplaySize } from '../utils/common_util';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const useWebGLInit = (canvasRef: MutableRefObject<HTMLCanvasElement | null>) => {
    console.log('useWebGLInit', canvasRef.current);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | undefined>(undefined);
    useEffect(() => {
        console.log('useWebGLInit', canvasRef.current);
        const canvasEle = document.getElementById('webgl') as HTMLCanvasElement;
        setCanvas(canvasEle);
    }, [canvasRef]);

    if (!canvas) {
        return;
    }
    // const canvas = canvasRef.current;
    resizeCanvasToDisplaySize(canvas);
    let gl = canvas.getContext('webgl') as WebGLRenderingContext;
    console.log('gl', gl);
    //指定清空的颜色
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    return gl;
};
