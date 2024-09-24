uniform float uMorphFactor;
attribute vec3 torusPosition;
attribute vec3 lemniscatePosition;

varying vec3 vNormal;

void main() {
    vec3 morphedPosition = mix(torusPosition, lemniscatePosition, uMorphFactor);
    vec4 modelPosition = modelMatrix * vec4(morphedPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
    // Interpolate normals
     vNormal = normalize(normalMatrix * normal);
}