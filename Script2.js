			var container;
			//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var camera, scene, renderer, controls;
			var mouseX = 0, mouseY = 0;
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			var scope = this;
			
			var geometry = new THREE.SphereGeometry(3000, 60, 40);  

			this.init();
			this.animate();
			function init() {
				container = document.createElement( 'div' );
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 250;
				
				// scene
				scene = new THREE.Scene();
				var ambient = new THREE.AmbientLight( 0x101030 );
				scene.add( ambient );
				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				controls = new THREE.OrbitControls( camera );
            	controls.addEventListener( 'change', this.render );
				scene.add( directionalLight );
				var bgScene = new THREE.Scene();
				var bgCam = new THREE.Camera();
				var texture = THREE.ImageUtils.loadTexture( "earthmap2k.jpg" );
				
				
				// texture
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
				
				//sky tex
				var uniforms = {  
  					//var texture = THREE.ImageUtils.loadTexture( "earthmap2k.jpg" );
				};

				
				// model
				var loader = new THREE.OBJLoader( manager );
				loader.load( 'Quad.obj', function ( object ) {
					object.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							child.material.map = texture;
						}
					} );
					object.position.y = 15;
					scene.add( object );
				}, onProgress, onError );
				
				var bg = new THREE.Mesh(
 	 				new THREE.PlaneGeometry(2, 2, 0),
  					new THREE.MeshBasicMaterial({map: texture.image})
				);
				
				//sky
				var material = new THREE.ShaderMaterial( {  
  					uniforms:       texture,
  					vertexShader:   document.getElementById('sky-vertex').textContent,
  					fragmentShader: document.getElementById('sky-fragment').textContent
				});
				
				// The bg plane shouldn't care about the z-buffer.
				bg.material.depthTest = false;
				bg.material.depthWrite = false;

				
				bgScene.add(bgCam);
				bgScene.add(bg);
				
				var geometry = new THREE.CylinderGeometry( 0, 1, 5, 4, 1 );
  				var material = new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

  				for ( var i = 0; i < 10; i ++ ) {

    				var mesh = new THREE.Mesh( geometry, material );
    				mesh.position.x = ( Math.random() - 0.5 ) * 100;
    				mesh.position.y = ( Math.random() - 0.5 ) * 100;
    				mesh.position.z = ( Math.random() - 0.5 ) * 100;
    				mesh.updateMatrix();
   					mesh.matrixAutoUpdate = false;
    				scene.add( mesh );

  				}
				
				skyBox = new THREE.Mesh(geometry, material);  
				skyBox.scale.set(-1, 1, 1);  
				skyBox.eulerOrder = 'XZY';  
				skyBox.renderDepth = 1000.0;  
				scene.add(skyBox);  
				
				/*light = new THREE.DirectionalLight( 0xffffff );
            	light.position.set( 1, 1, 1 );
           		scene.add( light );

            	light = new THREE.DirectionalLight( 0xffffff  );
            	light.position.set( -1, -1, -1 );
            	scene.add( light );

            	light = new THREE.AmbientLight( 0xffffff );
            	scene.add( light );*/
            
            
				//
				renderer = new THREE.WebGLRenderer({alpha: true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				//document.addEventListener('click', onclick,false);				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function onclick( event ) {
				mouseX = ( event.clientX - windowHalfX ) / 2;
				mouseY = ( event.clientY - windowHalfY ) / 2;
			}
			//
			this.animate = function () {
				requestAnimationFrame( animate );
				controls.update();
				this.render();
			}
			this.render = function () {
				//camera.position.x += ( mouseX - camera.position.x ) * .05;
				//camera.position.y += ( - mouseY - camera.position.y ) * .05;
				//camera.lookAt( scene.position );
				scope.renderer.autoClear = false;
				scope.renderer.clear();
				//renderer.render(this.bgScene, this.bgCam);
				scope.renderer.render( scope.scene, scope.camera );
				//stats.update();
			}
	