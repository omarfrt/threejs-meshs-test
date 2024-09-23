varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
varying vec3 vNormal;
void main() {
    //nomrmalize mormal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing ){
        normal = -normal;
    }
    float stripes = mod((vPosition.y- uTime *0.02) *20.0,1.0 );
    stripes = pow(stripes, 3.0);
    
    // fresnel 
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal)+1.0;
    fresnel = pow(fresnel, 2.0);
    //falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);  
    //hologram
    float hologram = fresnel * stripes;
    hologram += fresnel * 1.25; 
    hologram *= falloff;

    gl_FragColor = vec4(uColor, hologram);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}