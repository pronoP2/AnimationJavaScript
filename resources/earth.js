var renderer;
var scene;
var camera;
var cameraControl;

function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1, 1000);
    camera.position.x = 90;
    camera.position.y = 32;
    camera.position.z = 32;
    camera.lookAt(scene.position);

    cameraControl = new THREE.OrbitControls(camera);
}

function createLight() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 10, -50);
    directionalLight.name = 'directional';
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);
}


function createEarth() {
    //create geometry
    var sphereGeometry = new THREE.SphereGeometry(15, 30, 30);
    
    //load texture
    var earthTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('assets/earthmap2k.jpg', function(image){
        earthTexture.image = image;
        earthTexture.needsUpdate = true;
    });

    //create material
    var earthMaterial = new THREE.MeshPhongMaterial();
    earthMaterial.map = earthTexture;

    var earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.name = 'earth';
    scene.add(earthMesh);
}

function createClouds() {
    var sphereGeometry = new THREE.SphereGeometry(15.1, 30, 30);

    //load texture
    var cloudsTexture = new THREE.Texture();
    var loader = new THREE.ImageLoader();
    loader.load('assets/fair_clouds_1k.png', function(image){
        cloudsTexture.image = image;
        cloudsTexture.needsUpdate = true;
    });

    var cloudsMaterial = new THREE.MeshPhongMaterial();
    cloudsMaterial.map = cloudsTexture;
    cloudsMaterial.transparent = true;

    var cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMaterial);
    cloudsMesh.name = 'clouds';
    scene.add(cloudsMesh);

}

//init() gets executed once
function init() {

    scene = new THREE.Scene();
    
    createRenderer();
    createCamera();
    createLight();

    createEarth();
    createClouds();


    document.body.appendChild(renderer.domElement);

    //render() gets called at end of init
    //as it looped forever
    render();
}

//infinite loop
function render() {

    cameraControl.update();
    scene.getObjectByName('earth').rotation.y += 0.0005;
    scene.getObjectByName('clouds').rotation.y += 0.0007;


    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

init();
