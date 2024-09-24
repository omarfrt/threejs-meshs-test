import * as THREE from 'three'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import cristalVertexShader from './shaders/cristal/vertex.glsl'
import cristalFragmentShader from './shaders/cristal/fragment.glsl'
import hologramVertexShader from './shaders/hologram/vertex.glsl'
import hologramFragmentShader from './shaders/hologram/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject={}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//lights
const directionalLight = new THREE.DirectionalLight(0xff80c0, 100);
directionalLight.position.set(0, 2, 0); // You can adjust this position
directionalLight.castShadow = true;
//scene.add(directionalLight);

// Add a helper to visualize the directional light
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
//scene.add(directionalLightHelper);

// GUI controls for the directional light
// gui.addColor(directionalLight, 'color').name('Light Color');
// gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('Light Intensity');
// gui.add(directionalLight.position, 'x').min(-10).max(10).step(0.1).name('Light X');
// gui.add(directionalLight.position, 'y').min(-10).max(10).step(0.1).name('Light Y');
// gui.add(directionalLight.position, 'z').min(-10).max(10).step(0.1).name('Light Z');

// ..
// set background color to a shade of grey

scene.background = new THREE.Color(0x1E1E2E);
/**
 * Water
 */

//Color
debugObject.depthColor = '#186691'
debugObject.surfaceColor= '#9bd8ff'

// Material
// const crystalMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         uTime: { value: 0 },
//         uBigWavesElevation: { value: 0.2 },
//         uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
//         uBigWavesSpeed: { value: 0.75 },
//         uCrystalColor: { value: new THREE.Color(0x88ccff) },
//         uRefractionRatio: { value: 0.98 },
//         uFresnelBias: { value: 0.1 },
//         uFresnelScale: { value: 1.0 },
//         uFresnelPower: { value: 2.0 },
//         pointLightPosition: { value: new THREE.Vector3() },
//         pointLightColor: { value: new THREE.Color() },
//         pointLightIntensity: { value: 1.0 }
//     },
//     vertexShader: cristalVertexShader,
//     fragmentShader: cristalFragmentShader,
//     transparent: true,
// });
const crystalMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uCrystalColor: { value: new THREE.Color(0x88ccff) },
        uRefractionRatio: { value: 0.98 },
        uFresnelBias: { value: 0.1 },
        uFresnelScale: { value: 1.0 },
        uFresnelPower: { value: 2.0 },
        pointLightPosition: { value: new THREE.Vector3() },
        pointLightColor: { value: new THREE.Color(0xff80c0) },
        pointLightIntensity: { value: 1.0 }
    },
    vertexShader: cristalVertexShader,
    fragmentShader: cristalFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    //wireframe: true
});
//add gui control for the hologram color
const materialParameters = {}
materialParameters.Color = '#ff0000'
gui.addColor(materialParameters, 'Color').name('Hologram Color').onChange(()=>{
    hologramMaterial.uniforms.uColor.value.set(materialParameters.Color);
})

const hologramMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(materialParameters.Color) }
    },
    vertexShader: hologramVertexShader,
    fragmentShader: hologramFragmentShader,
    transparent: true,
    //the problem with the sircle plane meshes are double sides
    //fixed by inverting the normals on the fragment shader by checking if gl_FrontFacing is false
    // still visible a bit but not as bad to fully fix add depthWrite= false
    depthWrite: false,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
});


// Add GUI controls for fine-tuning
// gui.add(crystalMaterial.uniforms.uRefractionRatio, 'value', 0, 1, 0.01).name('Refraction');
// gui.add(crystalMaterial.uniforms.uFresnelBias, 'value', 0, 1, 0.01).name('Fresnel Bias');
// gui.add(crystalMaterial.uniforms.uFresnelScale, 'value', 0, 2, 0.01).name('Fresnel Scale');
// gui.add(crystalMaterial.uniforms.uFresnelPower, 'value', 0, 5, 0.1).name('Fresnel Power');
// gui.add(crystalMaterial.uniforms.pointLightIntensity, 'value', 0, 5, 0.1).name('Light Intensity');
//water material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime:{value:0},
        uBigWavesSpeed:{value:0.75},
        uBigWavesElevation:{value:0.2},
        uBigWavesFrequency:{value: new THREE.Vector2(4.0,1.5)},
        uDepthColor:{value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor:{value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset:{value:0.08},
        uColorMultiplier:{value:5},
    }
})
//Debug
// gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigwavesElevation')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'x').min(0).max(10).step(0.001).name('uBigwavesFrequency.X')
// gui.add(waterMaterial.uniforms.uBigWavesFrequency.value,'y').min(0).max(10).step(0.001).name('uBigwavesFrequency.Y')
// gui.add(waterMaterial.uniforms.uBigWavesSpeed,'value').min(0).max(2).step(0.001).name('uBigwavesSpeed')
// gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
// gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
// gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(()=>{
//     waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
// })
// gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(()=>{
//     waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
// })
// Mesh
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
// const water = new THREE.Mesh(waterGeometry, waterMaterial)
// water.rotation.x = - Math.PI * 0.5
// water.position.y = -2
// scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
//inifinty geometry test

class LemniscateCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const a = this.scale;
        const theta = t * 2 * Math.PI;
        const x = (a * Math.sqrt(2) * Math.cos(theta)) / (Math.sin(theta) * Math.sin(theta) + 1);
        const y = (a * Math.sqrt(2) * Math.cos(theta) * Math.sin(theta)) / (Math.sin(theta) * Math.sin(theta) + 1);
        const z = 0; // Keep it flat for now
        return optionalTarget.set(x, y, z);
    }
}

// Create the lemniscate curve
const lemniscateCurve = new LemniscateCurve(1);

// Create the tube geometry around the lemniscate curve
const tubeGeometry = new THREE.TubeGeometry(lemniscateCurve, 100, 0.1, 20, true);

// the cristal cube
const cubeGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 64, 16);

// Create a mesh with the cube geometry and crystal material
const crystalCube = new THREE.Mesh(tubeGeometry, hologramMaterial);
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)
// const waterBasicMaterial = new THREE.MeshBasicMaterial({color:0xffffff})
// const waterPlane = new THREE.Mesh(waterGeometry, hologramMaterial)
// scene.add(waterPlane)
// waterPlane.rotation.x = - Math.PI * 0.5
// waterPlane.position.y = -1
// waterPlane.receiveShadow = true
// Position the cube (adjust as needed)
//crystalCube.position.set(0, 0.5, 0);
crystalCube.castShadow = true;
// Add the crystal cube to the scene
scene.add(crystalCube);
// const boxoneGeometry = new THREE.BoxGeometry(1,1,1)
// const boxone = new THREE.Mesh(boxoneGeometry, hologramMaterial)
//scene.add(boxone)
// boxone.position.y = -1.5

//torus
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 64, Math.PI * 2);
 // Red color for the torus
const torus = new THREE.Mesh(torusGeometry, hologramMaterial);
scene.add(torus);
torus.position.x = -3

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //water
    waterMaterial.uniforms.uTime.value =elapsedTime;
    crystalMaterial.uniforms.uTime.value = elapsedTime;
    //torus rotation
    // crystalCube.rotation.x = elapsedTime * 0.5;
    // crystalCube.rotation.y = elapsedTime * 0.3;
    //update light uniforms
    crystalMaterial.uniforms.pointLightPosition.value.copy(directionalLight.position);
    crystalMaterial.uniforms.pointLightColor.value.copy(directionalLight.color);
    crystalMaterial.uniforms.pointLightIntensity.value = directionalLight.intensity;
    crystalMaterial.uniforms.pointLightPosition.value.copy(directionalLight.position);
    //hologram
    hologramMaterial.uniforms.uTime.value = elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

