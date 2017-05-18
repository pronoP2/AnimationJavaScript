/**
 *
 * WebGL With Three.js - Lesson 5 - cubic skybox and reflection
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-5/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Script Tutorials
 * http://www.script-tutorials.com/
 */

var Assignment = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    controls: null,
    clock: null,
	video:null,
	videoimage:null,
	imageContext:null,
	imageReflection:null, imageReflectionContext:null, imageReflectionGradient:null,
			Screentexture:null, textureReflection:null,
	screen:null,
	userOpts:null,	
    //stats: null,
	bb8:null,
	anim:null,	
    mCube: null,
    mSphere: null,
    mCubeCamera: null,
    mSphereCamera: null,
	spLight:null,
	ambient:null,
	directionalLight:null,
	colour:null,
	orbit:null,
	dir:null,
	mixers:null,
    init: function() { // Initialization

        // create main scene
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;
		this.mixers = [];
        // prepare camera
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		this.camera.position.z = 250;
        this.scene.add(this.camera);
        this.camera.position.set(0, 30, 150);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
		this.orbit = false;

        // prepare renderer
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.setClearColor(0xffffff);

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        // prepare container
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);

        // events
        THREEx.WindowResize(this.renderer, this.camera);
		//var rotation_matrix = new THREE.Matrix4().setRotationX(.01);

        // prepare controls (OrbitControls)
		//if(this.orbit){
			this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
			this.controls.target = new THREE.Vector3(0, 0, 0);
			this.controls.maxDistance = 700;
		//}

        // prepare clock
		var time = 0;
		var angle = Math.PI/180;
        this.clock = new THREE.Clock();
		this.userOpts	= {
			range		: -6,
			duration	: 2500,
			delay		: 200,
			easing		: 'Elastic.EaseInOut'
		};
		/*
        // prepare stats
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '50px';
        this.stats.domElement.style.bottom = '50px';
        this.stats.domElement.style.zIndex = 1;
        this.container.appendChild( this.stats.domElement );*/

        // add point light
        this.spLight = new THREE.PointLight(0xffffff, 1.75, 1000);
        this.spLight.position.set(-100, 200, 200);
        this.scene.add(this.spLight);
		this.ambient = new THREE.AmbientLight( 0x101030 );
		this.scene.add( this.ambient );
		this.directionalLight = new THREE.DirectionalLight( 0xffeedd );
		this.directionalLight.position.set( 0, 0, 1 );
		this.scene.add( this.directionalLight );
		this.colour = 0;
		this.dir = 0;
		
		// Video elements
		//video = document.getElementById( 'video' );
		video = document.createElement( 'video' );
		video.src = "VID.mp4";
		video.load(); // must call after setting/changing source
		video.play();
		videoimage = document.createElement( 'canvas' );
		videoimage.width = 320;
		videoimage.height = 240;
		imageContext = videoimage.getContext( '2d' );
		imageContext.fillStyle = '#000000';
		imageContext.fillRect( 0, 0, 320, 240 );
		Screentexture = new THREE.Texture( videoimage );
		Screentexture.minFilter = THREE.LinearFilter;
		Screentexture.magFilter = THREE.LinearFilter;
		var material = new THREE.MeshBasicMaterial( { map: Screentexture, overdraw: true } );//, side:THREE.DoubleSide		
		var plane = new THREE.PlaneGeometry( 10, 10, 4, 4 );
		screen = new THREE.Mesh( plane, material );
		screen.position.z = -45;
		screen.position.x = -33.5;
		screen.position.y = 20;
		//screen.scale.x = screen.scale.y = screen.scale.z = 1.5;
		this.scene.add(screen);

        // add simple cube
        var cube = new THREE.Mesh( new THREE.CubeGeometry(50, 10, 50), new THREE.MeshLambertMaterial({color:0xffffff * Math.random()}) );
        cube.position.set(0, 0, 0);
        //this.scene.add(cube);
		
		/*var textureBB8 = new THREE.TextureLoader();

		var materialBB8 = new THREE.MeshPhongMaterial( {
					color: 0xdddddd,
					specular: 0x222222,
					shininess: 35,
					map: textureBB8.load( "bb8_spec.jpg" ),
					specularMap: textureBB8.load( "BB8_bump.jpg" ),
					normalMap: textureBB8.load( "bb8-droid-canvas.jpg" ),
					normalScale: new THREE.Vector2( 0.8, 0.8 )
		} );*/
		//loader.load( "'bb8.obj'", function( geometry ) { createBB8( geometry, 100, materialBB8 ) } );
		
		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total ) {
		 console.log( item, loaded, total );
		};
		var texture = new THREE.Texture();
		var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};
		var onError = function ( xhr ) {
		};
		var loader = new THREE.ImageLoader( manager );
		loader.load( 'earthmap2k.jpg', function ( image ) {
			texture.image = image;
			texture.needsUpdate = true;
		} );
		
		/*var uniforms = {
			texture: { type: 't', value: THREE.ImageUtils.loadTexture('NightSky.png') }
		};
		var skyMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById('vertexShader').textContent, fragmentShader: document.getElementById('fragmentShader').textContent
		});*/
		
		/*var loaderR = new THREE.OBJLoader( manager , new THREE.MeshLambertMaterial({color:0xffffff * Math.random()}));
		loaderR.load( 'Quad.obj', function ( object ) {
			object.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = this.texture;
				}
			} );
			object.position.y = 115;
			this.scene.add( object );
		}, this.onProgress, this.onError );*/
		
		
		
		 // add simple ground
		var ground = new THREE.Mesh( new THREE.PlaneBufferGeometry(40, 40, 10, 10) );
		ground.receiveShadow = true;
		ground.position.set(-20, -1.5, -15);
		ground.rotation.x = -Math.PI / 2;
		var groundmat = new THREE.MeshPhongMaterial({color:0x009000 , specular: 0x050505 });
		//this.groundMat.color.setHSL( 0.095, 1, 0.75 );
		ground.traverse( function(child) {
			if (child instanceof THREE.Mesh) {

				// apply custom material
				child.material = groundmat;

				// enable casting shadows
				//child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		this.scene.add(ground);
		
		
		
		this.loadFlame();
		// load quad
		this.loadQuad();
		
		// load BB8
		this.loadBB8();
		
		this.addAnimatedObjects();

        // add simple Sphericalsky
        this.drawSphericalSkybox();

        // add reflecting objects
        this.drawObjects();
    },
	loadFlame: function(){
		var loaderFlam = new THREE.JSONLoader();
				loaderFlam.load( "flamingo.js", function( geometry ) {
					var materialFlam = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
					var meshFlam = new THREE.Mesh( geometry, materialFlam );
					var s = 0.15;
					meshFlam.scale.set( s, s, s );
					meshFlam.position.y = 15;
					meshFlam.rotation.y = -1;
					meshFlam.castShadow = true;
					meshFlam.receiveShadow = true;
					Assignment.scene.add( meshFlam );
					var mixer = new THREE.AnimationMixer( meshFlam );
					mixer.clipAction( geometry.animations[ 0 ] ).setDuration( 1 ).play();
					Assignment.mixers.push( mixer );
				} );

	},

	loadQuad: function() {
		// prepare loader and load the model
		var oLoader = new THREE.OBJLoader();
		oLoader.load('Quad.obj', function(object) {

		// var material = new THREE.MeshFaceMaterial(materials);
		var material2 = new THREE.MeshLambertMaterial({ color: 0xa95e99 });

		object.traverse( function(child) {
			if (child instanceof THREE.Mesh) {

				// apply custom material
				child.material = material2;

				// enable casting shadows
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
  
		object.position.x = 0;
		object.position.y = 0;
		object.position.z = 0;
		object.scale.set(1, 1, 1);
		Assignment.scene.add(object);
		});

	},
	createBB8: function( geometry, scale, material ) {

		var mesh1 = new THREE.Mesh( geometry, material );

		mesh1.position.x = 6;
		mesh1.position.y = -2;
		mesh1.position.z = 10;
		mesh1.scale.set(0.1, 0.1, 0.1);
		//mesh1.scale.x = mesh1.scale.y = mesh1.scale.z = scale;

		Assignment.scene.add( mesh1 );

	},
	loadBB8: function() {
		// prepare loader and load the model
		var oLoader = new THREE.OBJLoader();
		//new THREE.Mesh( new THREE.SphereGeometry(50, 32, 32), TextureMaterial );
		oLoader.load('bb8.obj', function(bb8) {

		// var material = new THREE.MeshFaceMaterial(materials);
		var material2 = new THREE.MeshLambertMaterial({ color: 0xa95533 });
		var textureBB8 = new THREE.TextureLoader();

		var materialBB8 = new THREE.MeshPhongMaterial( {
					color: 0xdddddd,
					specular: 0x222222,
					shininess: 35,
					map: textureBB8.load( "bb8_spec.jpg" ),
					specularMap: textureBB8.load( "BB8_bump.jpg" ),
					normalMap: textureBB8.load( "bb8-droid-canvas.jpg" ),
					normalScale: new THREE.Vector2( 0.8, 0.8 )
		} );

		bb8.traverse( function(child) {
			if (child instanceof THREE.Mesh) {

				// apply custom material
				child.material = materialBB8;

				// enable casting shadows
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		this.bb8 = bb8;
		//bb8.position.x = -Assignment.userOpts.range;
		this.bb8.position.x = -6;
		this.bb8.position.y = -2;
		this.bb8.position.z = 10;
		this.bb8.scale.set(0.1, 0.1, 0.1);
		Assignment.scene.add(this.bb8);
		});

	},

	drawSphericalSkybox: function() {
    // prepare ShaderMaterial
		var uniforms = {
			texture: { type: 't', value: THREE.ImageUtils.loadTexture('NightSky.png') }
		};
		var skyMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById('vertexShader').textContent, fragmentShader: document.getElementById('fragmentShader').textContent
		});

    // create Mesh with sphere geometry and add to the scene
		var skyBox = new THREE.Mesh(new THREE.SphereGeometry(250, 60, 40), skyMaterial);
		skyBox.scale.set(-1, 1, 1);
		skyBox.eulerOrder = 'XZY';
		skyBox.renderDepth = 500.0;

		this.scene.add(skyBox);
	},
	 addAnimatedObjects: function() {

		var texture1 = new THREE.ImageUtils.loadTexture('sprite.png', undefined, function() {
			Assignment.anim = new TileTextureAnimator(texture1, 8, 8, 100);
			var material1 = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: false, side:THREE.DoubleSide, transparent: true } );
			var mesh1 = new THREE.Sprite(material1);
			mesh1.position.set(-10, 5, -20);
			mesh1.scale.set(20, 20, 1.0);
			Assignment.scene.add(mesh1);
			Assignment.animReady1 = true;
		});
	 },

    drawObjects: function() {
        // Object 1: rectangle

        // create additional camera
        this.mCubeCamera = new THREE.CubeCamera(1, 1000, 1000); // near, far, cubeResolution
        this.scene.add(this.mCubeCamera);

        // create mirror material and mesh
        var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: this.mCubeCamera.renderTarget, side: THREE.DoubleSide } );
        this.mCube = new THREE.Mesh( new THREE.CubeGeometry(50, 50, 1, 1, 1, 1), mirrorCubeMaterial);
        this.mCube.position.set(-150, 0, -30);
		this.mCube.rotation.y = 30;
        this.mCubeCamera.position = this.mCube.position;
        this.mCubeCamera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.mCube);

        // Object 2: Earth

        // create additional camera
        this.mSphereCamera = new THREE.CubeCamera(0.1, 1000, 100);
        this.scene.add(this.mSphereCamera);

        // create material and mesh
		
		var uniforms = {
			texture: { type: 't', value: THREE.ImageUtils.loadTexture('earthmap2k.jpg') }
		};
		var TextureMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById('vertexShader').textContent, fragmentShader: document.getElementById('fragmentShader').textContent
		});
        //var mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: this.mSphereCamera.renderTarget, side: THREE.DoubleSide } );
        this.mSphere = new THREE.Mesh( new THREE.SphereGeometry(50, 32, 32), TextureMaterial );
        this.mSphere.position.set(150, 0, -150);
        this.mSphereCamera.position = this.mSphere.position;
		this.mSphere.castShadow = true;
		this.mSphere.receiveShadow = true;
        this.mSphereCamera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.mSphere);
		this.mSphere.rotation.set(0, Math.PI/4, 0);
		
		// Small cones
		this.mConeCamera = new THREE.CubeCamera(10, 1000, 1000);
		
		var geometry = new THREE.CylinderGeometry( 0, 1, 5, 4, 1 );
  		var material = new THREE.MeshBasicMaterial( {  envMap: this.mConeCamera.renderTarget, side: THREE.DoubleSide } );

  		for ( var i = 0; i < 10; i ++ ) {

			this.scene.add(this.mConeCamera);
    		this.mesh = new THREE.Mesh( geometry, material );
    		this.mesh.position.x = ( Math.random() - 0.5 ) * 100;
    		this.mesh.position.y = ( Math.random() - 0.5 ) * 100;
    		this.mesh.position.z = ( Math.random() - 0.5 ) * 100;
    		this.mesh.updateMatrix();
   			this.mesh.matrixAutoUpdate = false;
    		this.scene.add( this.mesh );

  		}
    }
};

// setup tween
function setupTween()
{
	// 
	var update	= function(){
		Assignment.loadBB8();
		Assignment.bb8.position.x = current.x;
	}
	var current	= { x: -Assignment.userOpts.range };

	// remove previous tweens if needed
	TWEEN.removeAll();
	
	// convert the string from dat-gui into tween.js functions 
	var easing	= TWEEN.Easing[Assignment.userOpts.easing.split('.')[0]][Assignment.userOpts.easing.split('.')[1]];
	// build the tween to go ahead
	var tweenHead	= new TWEEN.Tween(current)
		.to({x: +Assignment.userOpts.range}, Assignment.userOpts.duration)
		.delay(Assignment.userOpts.delay)
		.easing(easing)
		.onUpdate(update);
	// build the tween to go backward
	var tweenBack	= new TWEEN.Tween(current)
		.to({x: -Assignment.userOpts.range}, Assignment.userOpts.duration)
		.delay(Assignment.userOpts.delay)
		.easing(easing)
		.onUpdate(update);

	// after tweenHead do tweenBack
	tweenHead.chain(tweenBack);
	// after tweenBack do tweenHead, so it is cycling
	tweenBack.chain(tweenHead);

	// start the first
	tweenHead.start();
}

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
	Assignment.mSphere.rotation.y += 0.01;
	var delta = Assignment.clock.getDelta();

	if (Assignment.animReady1) {
		Assignment.anim.update(10000 * delta);
	}
	for ( var i = 0; i <  Assignment.mixers.length; i ++ ) {
					 Assignment.mixers[ i ].update( delta );
				}
	//Assignment.bb8.position.x = Assignment.bb8.position.x - 0.1;
	//Assignment.bb8.position.z = Assignment.bb8.position.z - 0.2;
	Assignment.time += 0.01;
	//TWEEN.update();
    render();
    update();
}

// Update controls and stats
function update() {
	//if(Assignment.orbit)
    Assignment.controls.update(Assignment.clock.getDelta());
    //Assignment.stats.update();
}
var x = 1;
// Render the scene
function render() {
    if (Assignment.renderer) {
		
		if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
            {
                imageContext.drawImage( video, 0, 0 );
                if ( Screentexture ) 
                    Screentexture.needsUpdate = true;
            }
        // update reflecting objects
        //Assignment.mCube.visible = false;
        Assignment.mCubeCamera.updateCubeMap(Assignment.renderer, Assignment.scene);
        Assignment.mCube.visible = true;
		if(Assignment.mSphere.position.x < -203 && Assignment.mSphere.position.z < -154 || Assignment.mSphere.position.x > 200 && Assignment.mSphere.position.z < -150)//200.99745002125042 -149.49000849995696
			this.x = -1;
		//else
			//this.x = 1;
		Assignment.angle = Assignment.angle * x; 
		Assignment.mSphere.position.x = Assignment.mSphere.position.x - this.x*Math.cos(0.01);	// 20*Math.cos(0.01)+
		Assignment.mSphere.position.z = Assignment.mSphere.position.z  - this.x*Math.sin(0.01);	//20*Math.sin(0.01)+
		console.log(Assignment.mSphere.position.x, Assignment.mSphere.position.z)
		//Assignment.mSphere.position.x = 100*Math.cos(Assignment.time* Assignment.angle);// + Assignment.mSphere.position.x;
		//Assignment.mSphere.position.z = 100*Math.sin(Assignment.time* Assignment.angle);// + Assignment.mSphere.position.z;

        Assignment.mSphere.visible = false;
        Assignment.mSphereCamera.updateCubeMap(Assignment.renderer, Assignment.scene);
        Assignment.mSphere.visible = true;
		//Assignment.mSphere.shadowMap.enabled = true;
		//Assignment.mSphere.shadowMapSoft = true;
		
		

        Assignment.renderer.render(Assignment.scene, Assignment.camera);
    }
}

function lightIntens(){
	if(Assignment.directionalLight.intensity < 2)
		Assignment.directionalLight.intensity += 0.5;
	else if(Assignment.directionalLight.intensity == 2 && Assignment.ambient.intensity > -8)
		Assignment.ambient.intensity -= 0.5;
	else if(Assignment.directionalLight.intensity == 2 && Assignment.ambient.intensity == -8){
		Assignment.directionalLight.intensity = 0.5;
		Assignment.ambient.intensity = 0.5;
	}
		
}
function lightColor(){
	Assignment.colour += 1;
	if(Assignment.colour == 1)
		Assignment.directionalLight.color.setHex( 0xff0000 );
	else if(Assignment.colour == 2)
		Assignment.directionalLight.color.setHex( 0xffff00 );
	else if(Assignment.colour == 3)
		Assignment.directionalLight.color.setHex( 0xff00ff );
	else if(Assignment.colour == 4)
		Assignment.directionalLight.color.setHex( 0x00ffff );
	else if(Assignment.colour == 5)
		Assignment.directionalLight.color.setHex( 0x0000ff );
	else {
		Assignment.colour = 0;
		Assignment.directionalLight.color.setHex( 0xffffff );
	}
}

function lightDir(){
	Assignment.dir += 1;
	if(Assignment.dir == 1)
		Assignment.directionalLight.position.set(100, -200, -200);
	else if(Assignment.dir == 2)
		Assignment.directionalLight.position.set(100, -200, 200);
	else {
		Assignment.dir =0;
		Assignment.directionalLight.position.set(-100, 200, 200);
	}
}
function cameraClick(){
	if(Assignment.orbit)
		Assignment.orbit = false;
	else
		Assignment.orbit = true;
}
function ONOFF(){
	if(Assignment.directionalLight.visible && Assignment.ambient.visible && Assignment.spLight.visible){
		Assignment.directionalLight.visible = false;
		Assignment.ambient.visible = false;
		Assignment.spLight.visible = false;
	}
	else {
		Assignment.directionalLight.visible = true;
		Assignment.ambient.visible = true;
		Assignment.spLight.visible = true;
		
	}
	
}

function TileTextureAnimator(texture, hTiles, vTiles, durationTile) {

  // current tile number
  this.currentTile = 0;

  // duration of every tile
  this.durationTile = durationTile;

  // internal time counter
  this.currentTime = 0;

  // amount of horizontal and vertical tiles, and total count of tiles
  this.hTiles = hTiles;
  this.vTiles = vTiles;
  this.cntTiles = this.hTiles * this.vTiles;

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  texture.repeat.set(1 / this.hTiles, 1 / this.vTiles);

  this.update = function(time) {
    this.currentTime += time;

    while (this.currentTime > this.durationTile) {
      this.currentTime -= this.durationTile;
      this.currentTile++;

      if (this.currentTile == this.cntTiles) {
        this.currentTile = 0;
      }

      var iColumn = this.currentTile % this.hTiles;
      texture.offset.x = iColumn / this.hTiles;
      var iRow = Math.floor(this.currentTile / this.hTiles);
      texture.offset.y = iRow / this.vTiles;
    }
  };
}

// Initialize lesson on page load
function initializeLesson() {
    Assignment.init();
	//setupTween();
    animate();
}

if (window.addEventListener)
    window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
    window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
