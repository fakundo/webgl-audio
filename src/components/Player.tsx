import React, { useCallback, useRef } from 'react'
import { createProgram } from 'utils/webgl'
import useData from 'utils/useData'
import Canvas, { CanvasData } from 'components/Canvas'
import Audio from 'components/Audio'
import vShaderSrc from 'shaders/base.vert'

const triangleVerticles = [
  -1, 1, 1, 1, -1, -1,
  -1, -1, 1, 1, 1, -1,
]

const startTime = new Date().getTime()

export default () => {
  const { audioSrc, fShaderSrc } = useData()

  const programRef = useRef<WebGLProgram>(null!)
  const analyzerRef = useRef<AnalyserNode>()
  const analyzerDataRef = useRef<Uint8Array>()

  const handleCanvasInit = useCallback(({ gl }: CanvasData) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticles), gl.STATIC_DRAW)

    programRef.current = createProgram(gl, vShaderSrc, fShaderSrc)
    gl.useProgram(programRef.current)

    const aPos = gl.getAttribLocation(programRef.current, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
  }, [fShaderSrc])

  const handleCanvasDestroy = useCallback(({ gl }: CanvasData) => {
    gl.deleteProgram(programRef.current)
  }, [])

  const handleCanvasRender = useCallback(({ gl, canvas }: CanvasData) => {
    const uTime = gl.getUniformLocation(programRef.current, 'u_time')
    gl.uniform1f(uTime, new Date().getTime() - startTime)

    const uRes = gl.getUniformLocation(programRef.current, 'u_resolution')
    gl.uniform2f(uRes, canvas.width, canvas.height)

    if (analyzerRef.current && analyzerDataRef.current) {
      analyzerRef.current.getByteFrequencyData(analyzerDataRef.current)
      const uTest = gl.getUniformLocation(programRef.current, 'u_audio')
      // @ts-ignore
      gl.uniform1fv(uTest, analyzerDataRef.current)
    }

    gl.drawArrays(gl.TRIANGLES, 0, triangleVerticles.length / 2)
  }, [])

  const handleAnalyzerReady = useCallback((analyzer: AnalyserNode) => {
    analyzer.fftSize = 32
    analyzerRef.current = analyzer
    analyzerDataRef.current = new Uint8Array(analyzer.frequencyBinCount)
  }, [])

  return (
    <>
      {!!audioSrc && <Audio
        play
        src={audioSrc}
        onAnalyzerReady={handleAnalyzerReady}
      />}
      <Canvas
        onInit={handleCanvasInit}
        onDestroy={handleCanvasDestroy}
        onRender={handleCanvasRender}
      />
    </>
  )
}
