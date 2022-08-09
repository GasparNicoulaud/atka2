import * as THREE from 'three'
import { Mesh } from 'three'
import ReactDOM from 'react-dom'
import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import niceColors from 'nice-color-palettes'
import Effects from './Effects'
import './styles.css'

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const colors = new Array(3000).fill().map(() => niceColors[17][Math.floor(Math.random() * 5)])

function Part(props) {
  const obj = useLoader(OBJLoader, props.file)
  const mat = new THREE.MeshBasicMaterial()
  mat.color = new THREE.Color('#28af69')
  mat.opacity = Math.abs(Math.sin(props.frame * 0.09)) * 0.5 + 0.2
  if (obj) {
    obj.traverse((child) => {
      if (child instanceof Mesh) {
        //child.material = mat;
      }
    })
  }
  const rotX = props.mouseX * 0.001 + props.frame * 0.008
  const rotY = props.mouseY * 0.001 + props.frame * 0.012
  return (
    <>
      <primitive
        position={[-0.02 * props.mouseX + 3, -0.02 * props.mouseX + 3, -0.02 * props.mouseX + 3]}
        rotation={[rotX, rotY, 0]}
        scale={1.5}
        object={obj}
      />
    </>
  )
}

function Model(props) {
  const [obj, set] = useState()
  useMemo(() => new OBJLoader().load(props.url, set), [props.url])
  return obj ? <primitive object={obj} position={props.position} /> : null
}

function Boxes() {
  //const [hovered, set] = useState()
  //const colorArray = useMemo(() => Float32Array.from(new Array(3000).fill().flatMap((_, i) => tempColor.set(colors[i]).toArray())), [])

  //const ref = useRef()
  //const previous = useRef()
  //useEffect(() => void (previous.current = hovered), [hovered])
  const [time, setTime] = useState()

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 2
    setTime(time)
    //ref.current.rotation.x = Math.sin(time / 4)
    //ref.current.rotation.y = Math.sin(time / 2)
    //let i = 0
    for (let x = 0; x < 10; x++)
      for (let y = 0; y < 10; y++)
        for (let z = 0; z < 30; z++) {
          //const id = i++
          tempObject.position.set(5 - x - 0.5, 5 - y, 13 - z + time * 0.2)
          //tempObject.rotation.y = Math.sin(x / 4 + time) + Math.sin(y / 4 + time) + Math.sin(z / 4 + time)
          //tempObject.rotation.z = tempObject.rotation.y * 0.5
          //if (hovered !== previous.current) {
          //tempColor.set(id === hovered ? 'white' : colors[id]).toArray(colorArray, id * 3)
          //tempColor.set('white').toArray(colorArray, id * 3)
          //ref.current.geometry.attributes.color.needsUpdate = true
          //}
          //const scale = id === hovered ? 2 : 1
          //tempObject.scale.set(scale, scale, scale)
          tempObject.updateMatrix()
          //ref.current.setMatrixAt(id, tempObject.matrix)
        }
    //ref.current.instanceMatrix.needsUpdate = true
  })

  //const obj = useLoader(OBJLoader, "/boule01.obj");

  return (
    <>
      <Model url="/modelv6.obj" position={[0, 0, Math.sin(time * 0.3) * 0.5 - 2]} />
      <meshStandardMaterial />
    </>
  )
}

ReactDOM.render(
  <Canvas
    gl={{ antialias: false, alpha: true }}
    camera={{ position: [0, 0, 1], near: 0.1, far: 20 }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
    <Suspense fallback={null}>
      <ambientLight intensity={0.05} />
      <pointLight position={[150, 150, 150]} intensity={0.55} />
      <Boxes />
      <Effects />
    </Suspense>
  </Canvas>,
  document.getElementById('root')
)
