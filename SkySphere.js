var geometry = new THREE.SphereGeometry(3000, 60, 40);  
var uniforms = {  
  var texture = THREE.ImageUtils.loadTexture( "earthmap2k.jpg" );
};

var material = new THREE.ShaderMaterial( {  
  uniforms:       uniforms,
  vertexShader:   document.getElementById('sky-vertex').textContent,
  fragmentShader: document.getElementById('sky-fragment').textContent
});

skyBox = new THREE.Mesh(geometry, material);  
skyBox.scale.set(-1, 1, 1);  
skyBox.eulerOrder = 'XZY';  
skyBox.renderDepth = 1000.0;  
scene.add(skyBox);  