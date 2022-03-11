export const pageConfig = {
    'webgl-programing-guide': {
        title: 'WebGL Programming Guide',
        path: '/',
        pages: [
            {
                title: 'Ch4: 高级变换与动画基础 &rarr;',
                path: 'ch4',
                pages: [
                    {
                        title: '平移，然后旋转',
                        path: 'TranslateRotate',
                    }, {
                        title: '动画',
                        path: 'Animate',
                    },
                ],
            },
            {
                title: 'Ch5 颜色与纹理 &rarr;',
                path: 'ch5',
                pages: [
                    {
                        title: '将非坐标数据传入顶点着色器',
                        path: 'PointSizeInVertShader',
                    },
                    {
                        title: 'gl.vertexAttribPointer() 的步进和偏移参数',
                        path: 'MultiAttributeSizeInterleaved',
                    },
                    {
                        title: '修改颜色（varying变量）',
                        path: 'ChangeColorByVarying',
                    },
                    {
                        title: '纹理映射',
                        path: 'Texture',
                    }, {
                        title: '多幅纹理映射',
                        path: 'MultiTexture',
                    },
                ],
            },
            {
                title: 'Ch7 进入三维世界 &rarr;',
                path: 'ch7',
                pages: [
                    {
                        title: '视点和视线',
                        path: 'EyePointAndViewDirection',
                    },
                    {
                        title: '观察旋转的三角形',
                        path: 'LookAtRotatedTrangles',
                    }, {
                        title: '正射投影',
                        path: 'OrthoView',
                    }, {
                        title: '透视投影',
                        path: 'PerspectiveView',
                    }, {
                        title: '模型矩阵、视图矩阵、投影矩阵组合',
                        path: 'ModelViewProjMatrix',
                    }, {
                        title: '立方体',
                        path: 'Cube',
                    }, {
                        title: '纯色立方体',
                        path: 'SingleColorCube',
                    },
                ],
            },
            {
                title: 'Ch8 光照 &rarr;',
                path: 'ch8',
                pages: [
                    {
                        title: '光照原理',
                        path: 'LightedCube',
                    }, {
                        title: '环境光',
                        path: 'LightedCubeAmbient',
                    }, {
                        title: '运动物体的光照',
                        path: 'LightedTranslatedRotatedCube',
                    },
                    {
                        title: '点光源光',
                        path: 'PointLightedCube',
                    }, {
                        title: '点光源光: 逐片元光照',
                        path: 'PointLightedCubeFragment',
                    },
                ],
            },
            {
                title: 'Ch9 关节模型 &rarr;',
                path: 'ch9',
                pages: [
                    {
                        title: '基础关节',
                        path: 'JointModel',
                    }, {
                        title: '多节点模型',
                        path: 'MultiJointModel',
                    },
                ],
            },
            {
                title: 'Ch10 高级技术 &rarr;',
                path: 'ch10',
                pages: [
                    {
                        title: '阴影',
                        path: '阴影',
                    },
                ],
            },
        ],
    },
};
