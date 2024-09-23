uniform vec3 uCrystalColor;
uniform float uRefractionRatio;
uniform float uFresnelBias;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform vec3 pointLightPosition;
uniform vec3 pointLightColor;
uniform float pointLightIntensity;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // Calculate view direction
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    
    // Calculate refraction
    vec3 refraction = refract(-viewDirection, normalize(vNormal), uRefractionRatio);
    
    // Calculate Fresnel effect
    float fresnel = uFresnelBias + uFresnelScale * pow(1.0 + dot(viewDirection, vNormal), uFresnelPower);
    
    // Mix refraction and crystal color based on Fresnel
    vec3 crystalEffect = mix(refraction, uCrystalColor, fresnel);

    // Calculate lighting
    vec3 lightDirection = normalize(pointLightPosition - vPosition);
    float diffuse = max(dot(vNormal, lightDirection), 0.0);
    
    // Add specular highlight
    vec3 reflectDir = reflect(-lightDirection, vNormal);
    float spec = pow(max(dot(viewDirection, reflectDir), 0.0), 32.0);
    vec3 specular = spec * pointLightColor;

    // Combine lighting components
    vec3 lightingEffect = (diffuse * pointLightColor + specular) * pointLightIntensity;

    // Blend crystal effect with lighting
    vec3 finalColor = crystalEffect * 0.6 + lightingEffect * 0.8;
    
    gl_FragColor = vec4(finalColor, 0.9); // Slightly transparent
}