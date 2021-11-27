/*const vertex = `#version 300 es TODO DELETE COMMENT
layout (location = 0) in vec4 aPosition;
layout (location = 1) in vec2 aTexCoord;

uniform mat4 uViewModel;
uniform mat4 uProjection;

out vec2 vTexCoord;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjection * uViewModel * aPosition;
}
`;
*/
const vertex = `#version 300 es
layout (location = 0) in vec4 aPosition;
layout (location = 2) in vec3 aNormal;
layout (location = 1) in vec2 aTexCoord;

uniform mat4 uViewModel;
uniform mat4 uProjection;
uniform vec3 uLightPosition;
uniform vec3 uLightAttenuation;

out vec3 vEye;
out vec3 vLight;
out vec3 vNormal;
out vec2 vTexCoord;
out float vAttenuation;

void main() {
    vec3 vertexPosition = (uViewModel * aPosition).xyz;
    vec3 lightPosition = (uViewModel * vec4(uLightPosition, 1)).xyz;
    vEye = -vertexPosition;
    vLight = lightPosition - vertexPosition;
    vNormal = (uViewModel * vec4(aNormal, 0)).xyz;
    vTexCoord = aTexCoord;

    float d = distance(vertexPosition, lightPosition);
    vAttenuation = 1.0 / dot(uLightAttenuation, vec3(1, d, d * d));

    gl_Position = uProjection * vec4(vertexPosition, 1);
}
`;
/*
const fragment = `#version 300 es TODO DELETE COMMENT
precision mediump float;

uniform mediump sampler2D uTexture;

in vec2 vTexCoord;

out vec4 oColor;

void main() {
    oColor = texture(uTexture, vTexCoord);
}
`;
*/
const fragment = `#version 300 es
precision mediump float;

uniform mediump sampler2D uTexture;

uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;

uniform float uShininess;

in vec3 vEye;
in vec3 vLight;
in vec3 vNormal;
in vec2 vTexCoord;
in float vAttenuation;

out vec4 oColor;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vLight);
    vec3 E = normalize(vEye);
    vec3 R = normalize(reflect(-L, N));

    float lambert = max(0.0, dot(L, N));
    float phong = pow(max(0.0, dot(E, R)), uShininess);

    vec3 ambient = uAmbientColor;
    vec3 diffuse = uDiffuseColor * lambert;
    vec3 specular = uSpecularColor * phong;

    vec3 light = (ambient + diffuse + specular) * vAttenuation;

    oColor = texture(uTexture, vTexCoord) * vec4(light, 1);
}
`;

export const shaders = {
    simple: { vertex, fragment }
};
