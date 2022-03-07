attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform mat4 u_MvpMatrix;
uniform mat4 u_NormalMatrix;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;

void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));
//    vec3 normal = normalize(vec3(a_Normal));
    //    cosθ = 光线方向 * 法线方向
    float nDotL = max(dot(u_LightDirection, normal), 0.0);
    //    漫反射光颜色 = 入射光颜色 * 表面基底色 * cosθ
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    //    环境光颜色 = 环境光 * 表面基底色
    vec3 ambient = u_AmbientLight * vec3(a_Color);
    //    最终颜色 = 环境光 + 漫反射光
    v_Color = vec4(diffuse + ambient, a_Color.a);
}
