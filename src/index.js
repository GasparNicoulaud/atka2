import * as THREE from 'three'
import { Mesh } from 'three'
import ReactDOM from 'react-dom'
import React, { useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Effects from './Effects'
import './styles.css'

function Model(props) {
  const [obj, set] = useState()
  useMemo(() => new OBJLoader().load(props.url, set), [props.url])
  const mat = new THREE.MeshBasicMaterial()
  mat.color = new THREE.Color('#4BE9D8')
  mat.opacity = 0.4
  mat.transparent = true
  mat.depthTest = false;
  if (obj) {
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = mat;
      }
    })
  }
  return obj ? <primitive object={obj} position={props.position} rotation={props.rotation} /> : null
}

function FullModel() {
  const [time, setTime] = useState(0)
  const position = useMousePosition();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 1.5
    setTime(time)
  })

  const modelPosition = [0, 0, -1];
  const modelRotation = [time*0.1 + position.x * 0.005, time*-0.2 + position.y * 0.005, 0];
  const PHI = 1.618033988749895;
  const s = 1.05 * 0.5;
  const uvs = [
    0,0,
    0,1,
    1,0
  ];

  // vertices
  const _01phi = new THREE.Vector3(0 * s, 1 * s, PHI * s);
  const _0m1phi = new THREE.Vector3(0 * s, -1 * s, PHI * s);
  const _01mphi = new THREE.Vector3(0 * s, 1 * s, -PHI * s);
  const _0m1mphi = new THREE.Vector3(0 * s, -1 * s, -PHI * s);

  const _1phi0 = new THREE.Vector3(1 * s, PHI * s, 0 * s);
  const _1mphi0 = new THREE.Vector3(1 * s, -PHI * s, 0 * s);
  const _m1phi0 = new THREE.Vector3(-1 * s, PHI * s, 0 * s);
  const _m1mphi0 = new THREE.Vector3(-1 * s, -PHI * s, 0 * s);

  const _phi01 = new THREE.Vector3(PHI * s, 0 * s, 1 * s);
  const _phi0m1 = new THREE.Vector3(PHI * s, 0 * s, -1 * s);
  const _mphi01 = new THREE.Vector3(-PHI * s, 0 * s, 1 * s);
  const _mphi0m1 = new THREE.Vector3(-PHI * s, 0 * s, -1 * s);

  // create triangles from vertices
  const faces = []

  faces[0] = new THREE.BufferGeometry().setFromPoints([_0m1phi,_m1mphi0,_1mphi0]);
  faces[1] = new THREE.BufferGeometry().setFromPoints([_0m1mphi,_1mphi0,_m1mphi0]);
  faces[2] = new THREE.BufferGeometry().setFromPoints([_0m1mphi,_m1mphi0,_mphi0m1]);
  faces[3] = new THREE.BufferGeometry().setFromPoints([_0m1mphi,_mphi0m1,_01mphi]);
  faces[4] = new THREE.BufferGeometry().setFromPoints([_0m1mphi,_01mphi,_phi0m1]);
  faces[5] = new THREE.BufferGeometry().setFromPoints([_mphi0m1,_m1phi0,_01mphi]);
  faces[6] = new THREE.BufferGeometry().setFromPoints([_mphi0m1,_mphi01,_m1phi0]);
  faces[7] = new THREE.BufferGeometry().setFromPoints([_mphi0m1,_m1mphi0,_mphi01]);
  faces[8] = new THREE.BufferGeometry().setFromPoints([_0m1mphi,_phi0m1,_1mphi0]);
  faces[9] = new THREE.BufferGeometry().setFromPoints([_phi01,_1mphi0,_phi0m1]);
  faces[10] = new THREE.BufferGeometry().setFromPoints([_phi01,_0m1phi,_1mphi0]);
  faces[11] = new THREE.BufferGeometry().setFromPoints([_phi01,_phi0m1,_1phi0]);
  faces[12] = new THREE.BufferGeometry().setFromPoints([_phi0m1,_01mphi,_1phi0]);
  faces[13] = new THREE.BufferGeometry().setFromPoints([_m1phi0,_1phi0,_01mphi]);
  faces[14] = new THREE.BufferGeometry().setFromPoints([_m1phi0,_01phi,_1phi0]);
  faces[15] = new THREE.BufferGeometry().setFromPoints([_phi01,_1phi0,_01phi]);
  faces[16] = new THREE.BufferGeometry().setFromPoints([_m1phi0,_mphi01,_01phi]);
  faces[17] = new THREE.BufferGeometry().setFromPoints([_0m1phi,_01phi,_mphi01]);
  faces[18] = new THREE.BufferGeometry().setFromPoints([_0m1phi,_mphi01,_m1mphi0]);
  faces[19] = new THREE.BufferGeometry().setFromPoints([_0m1phi,_phi01,_01phi]);

  for(var i=0; i< faces.length; i++){
    faces[i].setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
  }

  const mats = []
  const colors = useLoader(THREE.TextureLoader, "grad2.png");

  for(i=0; i< faces.length; i++){
    mats[i] = new THREE.MeshBasicMaterial()
    mats[i].transparent = true
    mats[i].side = THREE.DoubleSide
    mats[i].map = colors;
    mats[i].opacity = Math.abs(Math.sin(i + time * 0.5) * Math.cos(i * 1.2 + time)) * 0.5;
    mats[i].depthTest = false;
  }

  const faceMeshes = []
  for(i = 0; i < faces.length; i++) {
    faceMeshes.push(<mesh 
      position={modelPosition} 
      rotation={modelRotation} 
      material={mats[i]}
      geometry={faces[i]}
      key={i}
    />);
  }

  return (
    <>
      <Model url="/modelv7.obj" 
        position={modelPosition} 
        rotation={modelRotation}
      />
      {faceMeshes}
    </>
  )
}

const useMousePosition = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  React.useEffect(() => {
    const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);
  return position;
};

const Animation3D = () => {
  const camera = new THREE.PerspectiveCamera( 35, 1, 0.1, 20 );
  camera.position.set(0,0,3);
  return(
  <Canvas
    gl={{ antialias: false, alpha: true }}
    camera={camera}
    onCreated={({ gl }) => {
      gl.setPixelRatio(2)
    }}
  >  
    <Suspense fallback={null}>
      <ambientLight />
      <FullModel />
      <Effects />
    </Suspense>
  </Canvas>
  )
}

ReactDOM.render(
  <Animation3D/>,
  document.getElementById('root')
)
