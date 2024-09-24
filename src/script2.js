import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import hologramVertexShader from './shaders/hologram/vertex.glsl'
import hologramFragmentShader from './shaders/hologram/fragment.glsl'

import lemniscateVertexShader from './shaders/lemniscate/vertex.glsl'
import lemniscateFragmentShader from './shaders/lemniscate/fragment.glsl'

import morphVertexShader from './shaders/morph/vertex.glsl'
import morphFragmentShader from './shaders/morph/fragment.glsl'
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

// set background color to a shade of grey

scene.background = new THREE.Color(0x1E1E2E);
//lemniscate
const materialParameters = {}
materialParameters.Color = '#af1fe7'
gui.addColor(materialParameters, 'Color').name('Hologram Color').onChange(()=>{
    // hologramMaterial.uniforms.uColor.value.set(materialParameters.Color);
    // lemniscateMaterial.uniforms.uColor.value.set(materialParameters.Color);
    morphMaterial.uniforms.uColor.value.set(materialParameters.Color);
})

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

const torusRadius = 0.5;
const tubeRadius = 0.09;
const radialSegments = 64;
const tubularSegments = 128;
const torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius, radialSegments, tubularSegments, Math.PI * 2);
const lemniscateGeometry = new THREE.TubeGeometry(lemniscateCurve, tubularSegments, tubeRadius, radialSegments, true);

// Create a custom geometry for morphing
const morphGeometry = torusGeometry.clone();
morphGeometry.setAttribute('torusPosition', torusGeometry.attributes.position.clone());
morphGeometry.setAttribute('lemniscatePosition', lemniscateGeometry.attributes.position.clone());

// Create the morph material
const morphMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uColor: { value: new THREE.Color(materialParameters.Color) },
        uMorphFactor: { value: 0 }
    },
    vertexShader: morphVertexShader,
    fragmentShader: morphFragmentShader,
    side: THREE.DoubleSide,
    
});

// Create the morph mesh



// Add GUI control for morphing
gui.add(morphMaterial.uniforms.uMorphFactor, 'value', 0, 1, 0.01).name('Morph Factor');

//hologram

const hologramMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(materialParameters.Color) }
    },
    // vertexShader: hologramVertexShader,
    // fragmentShader: hologramFragmentShader,
    // transparent: true,
    //the problem with the sircle plane meshes are double sides
    //fixed by inverting the normals on the fragment shader by checking if gl_FrontFacing is false
    // still visible a bit but not as bad to fully fix add depthWrite= false
    // depthWrite: false,
    // side: THREE.DoubleSide,
    // transparent: true,
    // blending: THREE.AdditiveBlending,
});
const morphMesh = new THREE.Mesh(morphGeometry, morphMaterial);
scene.add(morphMesh);
//infinit
// const lemniscateMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         uTime: { value: 0 },
//         uColor: { value: new THREE.Color(materialParameters.Color) }
//     },
//     vertexShader: lemniscateVertexShader,
//     fragmentShader: lemniscateFragmentShader,
   
//    wireframe: true,
// });

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


//torus
// const torusGeometry = new THREE.TorusGeometry(1, 0.09, 64, 128, Math.PI * 2);
//  // Red color for the torus
// // const torus = new THREE.Mesh(torusGeometry, hologramMaterial);
// // scene.add(torus);

// //infinit
// const lemniscate = new THREE.Mesh(torusGeometry, lemniscateMaterial);
// scene.add(lemniscate);



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
camera.position.set(0, 0, 3)
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
   
    //hologram
    // hologramMaterial.uniforms.uTime.value = elapsedTime;
    // lemniscateMaterial.uniforms.uTime.value = elapsedTime;
    //morphMaterial.uniforms.uTime.value = elapsedTime;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

