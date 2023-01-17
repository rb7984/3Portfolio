import * as THREE from './three.module.js';
import {FBXLoader} from './FBXLoader.js';
import {gsap} from './gsap/index.js';
import {OrbitControls} from './OrbitControls.js';
// import {InteractionManager} from './three.interactive.js';

const container = document.querySelector('#scene-container');
export const scene = new THREE.Scene();

var clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(50,50,50);
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

//INTERACTIONS

// const interactionManager = new InteractionManager(
//     renderer,
//     camera,
//     renderer.domElement
// );

var g2 = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
var m2 = new THREE.MeshStandardMaterial({ color: '#2c61d4', side: THREE.DoubleSide });
var plane = new THREE.Mesh(g2, m2);
plane.rotateX( - Math.PI / 2);
plane.translateY(1);
plane.receiveShadow = true;
scene.add(plane);

//LIGHTS

const light = new THREE.AmbientLight( 0xdedede, 1.5);
light.castShadow = true;
scene.add(light);

const lightPoint = new THREE.PointLight( 0xc9e4ff, 1 );
lightPoint.position.set(0, 60, 0);
lightPoint.castShadow = true;
lightPoint.shadow.camera.near = 1;
lightPoint.shadow.camera.far = 500;
lightPoint.shadow.bias = - 0.002;
lightPoint.shadow.mapSize.set( 1600, 1600 );

scene.add(lightPoint);
// scene.add( new THREE.CameraHelper( lightPoint.shadow.camera ) );

//CONTROLS

//const controls = new OrbitControls(camera, renderer.domElement);
// const cPX = [50,-50,-50,50];
// const cPY = [50,50,50,50];
// const cPZ = [50,50,-50,-50];

const cP = [[50,50,50],[-60,7,-20],[-42,10,3],[-5,35,5]]
const cT = [[0,0,0],[20,6,-35],[-30,7,-2],[40,35,40]]
var cPC = 0;

function ChangeView(a) {
    if (a) {cPC += 1;}
    else {cPC -= 1;}
    gsap.to(camera.position, {
        x: cP[cPC%4][0],
        y: cP[cPC%4][1],
        z: cP[cPC%4][2],
        duration: 1,
        onUpdate: function () {
            camera.lookAt(cT[cPC%4][0],cT[cPC%4][1],cT[cPC%4][2]);
        }
    });
}

document.getElementById('previous').onclick = function () {
    ChangeView(false);
}

document.getElementById('next').onclick = function () {
    ChangeView(true);
}

const fbxLoader = new FBXLoader();
fbxLoader.load('../assets/model.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map,
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/p0.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map,
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/p1.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/p2.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    scene.add(object)
}
);

fbxLoader.load('../assets/prop.fbx', (object) => {
    object.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            node.castShadow = true; 
            node.receiveShadow = true;
            
            const oldMat = node.material;
            
            node.material = new THREE.MeshStandardMaterial( {  
                color: oldMat.color,
                map: oldMat.map
            } );
            
        } } );
    
    gsap.to(object.position, {x: 0, y: 25, z: 10, duration: 5, stagger:{ each: 0.15, yoyo: true, repeat: -1 }, ease: "sine.inOut"});
    
    scene.add(object)
}
);

//Orbit Controls

function UpdateCamera() {    
    const time = clock.getElapsedTime();
    const k = 0.15;
    const f = 100;
    
    camera.position.x = f*Math.sin( time*k );
    camera.position.y = 50;
    camera.position.z = f*Math.cos( time*k );
    
    camera.lookAt(0, 0, 0);
}

function animate() {
	requestAnimationFrame( animate );
    
    //INTERACTIONS
    // interactionManager.update();
    //CONTROLS
    // controls.update();
    
    if (cPC == 0) {UpdateCamera();}
    
    renderer.render( scene, camera );
};

animate();