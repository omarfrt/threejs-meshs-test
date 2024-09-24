uniform vec3 uColor;

varying vec3 vNormal;

void main() {
    // vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    // float diffuse = max(dot(vNormal, lightDirection), 0.0);
    // vec3 finalColor = uColor * (diffuse * 0.7 + 0.3); // Add some ambient light
    
    gl_FragColor = vec4(uColor, 1.0);
}