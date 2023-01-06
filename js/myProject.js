import * as THREE from './three.module.js';
import {OrbitControls} from './OrbitControls.js';
import {FBXLoader} from './FBXLoader.js';
import {InteractionManager} from './three.interactive.js';

const container = document.querySelector('#scene-container');
export const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set(-50,50,-50);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setClearColor("#ededed");

// renderer.setSize( container.clientWidth, container.clientHeight );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
container.append(renderer.domElement);
//document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
);

var g2 = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#a18787', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.receiveShadow = true;

scene.add(plane);

//Lights

const light = new THREE.AmbientLight( 0xdedede, 1.5);
light.castShadow = true;
scene.add(light);

const lightPoint = new THREE.PointLight( 0xdedede, 2, 30 );
lightPoint.position.set(0,30,0);
lightPoint.lookAt(0,0,0);
lightPoint.castShadow = true;
scene.add(lightPoint);

//Controls

const controls = new OrbitControls(camera, renderer.domElement);

const fbxLoader = new FBXLoader();
fbxLoader.load('../assets/model.fbx', (object) => {
    object.traverse( function( node ) { 
        if ( node instanceof THREE.Mesh ) { 
            node.castShadow = true; 
            node.receiveShadow = true;
            // node.material.side = THREE.DoubleSide;
        } } );
    object.translateY(0.01);
    scene.add(object)
}
);

function animate() {
	requestAnimationFrame( animate );
    
    interactionManager.update();
    controls.update();
	renderer.render( scene, camera );
};

animate();