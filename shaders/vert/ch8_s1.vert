attribute vec4 a_Position;
attribute vec4 a_Color;
//法向量
attribute vec4 a_Normal;

uniform mat4 u_MvpMatrix;
//光照颜色
uniform vec3 u_LightColor;
//光照方向 （归一化）
uniform vec3 u_LightDirection;

varying vec4 v_Color;

void main(){
    gl_Position = u_MvpMatrix * a_Position;
    //    对法向量归一化
    vec3 normal = normalize(vec3(a_Normal));
    //    计算光线方向和法向量的点积，算出 cosθ。
    //\vec{a} \cdot \vec{b} = |\vec{a}| \, |\vec{b}| \cos \theta \;
    //    cosθ = 光线方向 * 法线方向
    float nDotL = max(dot(u_LightDirection, normal), 0.0);

    //    漫反射光颜色 = 入射光颜色 * 表面基底色 * cosθ
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;

    v_Color = vec4(diffuse, a_Color.a);
}
