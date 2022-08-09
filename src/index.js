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
  mat.opacity = 0.6
  mat.transparent = true
  mat.depthTest = false;
  if (obj) {
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = mat;
      }
    })
  }
  return obj ? <>
    <primitive object={obj} position={props.position} rotation={props.rotation} />
  </> : null
}

function Boxes() {
  const [time, setTime] = useState()

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 1.5
    setTime(time)
  })

  const position = useMousePosition();

  const colors = useLoader(THREE.TextureLoader, "gradientv3.png");

  const mat = new THREE.MeshPhongMaterial()
  mat.color = new THREE.Color('#4BE9D8')
  mat.opacity = 0.2
  mat.transparent = true
  mat.depthTest = false;
  mat.depthWrite = false;
  mat.map = colors;
  return (
    <>
      <Model url="/modelv7.obj" position={[0, 0, -1]} rotation={[time*0.1 + position.x * 0.001, time*-0.2 + position.y * 0.001, 0]}/>
      <mesh position={[0, 0, -1]} rotation={[time*0.1 + position.x * 0.001, time*-0.2 + position.y * 0.001, 0]} material={mat}>
        <icosahedronGeometry attach="geometry" detail={0}/>
      </mesh>
    </>
  )
}

ReactDOM.render(
  <Canvas
    gl={{ antialias: false, alpha: true }}
    camera={{fov: 35, position: [0, 0, 3], near: 0.1, far: 20 }}
    onCreated={({ gl }) => {
      gl.setClearColor(0x000000, 0)
      gl.setPixelRatio(2)
    }}
  >  
    <Suspense fallback={null}>
      <ambientLight color={new THREE.Color('#ffffff')} />
      {/* '#00ACE2'
      '#
      'rgb(100,253,212)' */}
      {/* <pointLight position={[150, 150, 150]} intensity={20} color={new THREE.Color('#ffffff')}/> */}
      <Boxes />
      <Effects />
    </Suspense>
  </Canvas>,
  document.getElementById('root')
)


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