import React, { useRef, useEffect, useMemo } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

extend({ EffectComposer, ShaderPass, RenderPass, SSAOPass, UnrealBloomPass, BokehPass })

export default function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const params = useMemo(() => ({ focus: 3.2, aperture: 0.04, maxblur: 0.015 }), [])
  useEffect(() => void composer.current.setSize(size.width * 2, size.height * 2), [size])
  useFrame(() => composer.current.render(), 2)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass
        attachArray="passes"
        args={[FXAAShader]}
        material-uniforms-resolution-value={[0.25 / size.width, 0.25 / size.height]}
        renderToScreen
      />
      <bokehPass attachArray="passes" args={[scene, camera, params]} />
    </effectComposer>
  )
}
