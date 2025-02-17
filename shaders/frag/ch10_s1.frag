precision mediump float;

uniform sampler2D u_ShadowMap;
varying vec4 v_Color;
varying vec4 v_PositionFromLight;

void main() {

    //
    vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w)/2.0 + 0.5;
    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
    float depth = rgbaDepth.r;
    float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;
    gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
}
