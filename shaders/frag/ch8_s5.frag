precision mediump float;

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main() {
    vec3 normal = normalize(v_Normal);
    vec3 lightDirection = normalize(u_LightPosition - v_Position);
    //    cosθ = 光线方向 * 法线方向
    float nDotL = max(dot(lightDirection, normal), 0.0);
    //    漫反射光颜色 = 入射光颜色 * 表面基底色 * cosθ
    vec3 diffuse = u_LightColor * vec3(v_Color) * nDotL;
    //    环境光颜色 = 环境光 * 表面基底色
    vec3 ambient = u_AmbientLight * vec3(v_Color);
    //    最终颜色 = 环境光 + 漫反射光
    gl_FragColor = vec4(diffuse + ambient, v_Color.a);;
}
