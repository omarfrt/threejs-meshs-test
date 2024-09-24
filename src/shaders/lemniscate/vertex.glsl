uniform float uTime;
varying vec3 vPosition;


#define PI 3.14159265359

vec3 lemniscateOfBernoulli(float t, float a) {
    float cos_t = cos(t);
    float sin_t = sin(t);
    float denom = 1.0 + sin_t * sin_t;
    return vec3(
        a * cos_t / denom,
        a * sin_t * cos_t / denom,
        0.0
    );
}

void main() {
    // float morphFactor = clamp(uTime * 0.1, 0.0, 1.0);
    
    // // Calculate the angle around the torus
    // float angle = atan(position.y, position.x);
    
    // // Calculate the lemniscate position
    // vec3 lemniscatePos = lemniscateOfBernoulli(angle, 1.0);
    
    // // Interpolate between torus and lemniscate
    // vec3 morphedPosition = mix(position, lemniscatePos, morphFactor);
      
    // // Add thickness based on morph factor
    // float thicknessFactor = 1.0 + morphFactor * 2.0; // Adjust multiplier as needed
    // morphedPosition *= thicknessFactor;
    
    // vec4 modelPosition = modelMatrix * vec4(morphedPosition, 1.0);
    // gl_Position = projectionMatrix * viewMatrix * modelPosition;
    
    // vPosition = modelPosition.xyz;
    
    float morphFactor = clamp(uTime * 0.1, 0.0, 1.0);
    
    // Use UV.x for the angle around the torus
    float angle = uv.x * 2.0 * PI;
    
    // Calculate the lemniscate position
    vec3 lemniscatePos = lemniscateOfBernoulli(angle, 1.0);
    
    // Calculate the torus position
    float torusRadius = 1.0;
    float tubeRadius = 0.2;
    vec3 torusPos = vec3(
        (torusRadius + tubeRadius * cos(uv.y * 2.0 * PI)) * cos(angle),
        (torusRadius + tubeRadius * cos(uv.y * 2.0 * PI)) * sin(angle),
        tubeRadius * sin(uv.y * 2.0 * PI)
    );
    
    // Interpolate between torus and lemniscate
    vec3 morphedPosition = mix(torusPos, lemniscatePos, morphFactor);
    
    // Add thickness to lemniscate
    morphedPosition += normalize(vec3(morphedPosition.xy, 0.0)) * tubeRadius * (1.0 - morphFactor);
    morphedPosition.z += tubeRadius * sin(uv.y * 2.0 * PI) * (1.0 - morphFactor);
    
    vec4 modelPosition = modelMatrix * vec4(morphedPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}