attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform mat4 u_ModelMatrix;
uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;

void main(){
    gl_Position = u_MvpMatrix * a_Position;
//    Recalculate the normal based on the model matrix and make its length 1.
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
//    计算世界坐标的顶点位置
    vec4 vertexPosition = u_ModelMatrix * a_Position;
//    计算光线方向. u_LightPosition在平行光源时，可以认为是与（0，0，0）的方向，
//    现在光源变成了点光源，需要计算每个顶点与光源的方向，u_LightPosition可以认为时光源的位置
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));
    //    cosθ = 光线方向 * 法线方向
    float nDotL = max(dot(lightDirection, normal), 0.0);
    //    漫反射光颜色 = 入射光颜色 * 表面基底色 * cosθ
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    //    环境光颜色 = 环境光 * 表面基底色
    vec3 ambient = u_AmbientLight * vec3(a_Color);
    //    最终颜色 = 环境光 + 漫反射光
    v_Color = vec4(diffuse + ambient, a_Color.a);
}
