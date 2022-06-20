import React, { useEffect, useRef, CSSProperties } from 'react'
import { resizeAndClearCanvas } from 'utils/webgl'
import { stretchStyle } from 'utils/css'

interface PropTypes {
  onRender?: (data: CanvasData) => void
  onInit?: (data: CanvasData) => void
  onDestroy?: (data: CanvasData) => void
  style?: object
}

export interface CanvasData {
  gl: WebGLRenderingContext
  canvas: HTMLCanvasElement
}

const defaultStyle: CSSProperties = {
  ...stretchStyle(),
}

export default (props: PropTypes) => {
  const { onRender, onInit, onDestroy, style, ...rest } = props
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const dataRef = useRef<CanvasData>()

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl')!
    dataRef.current = { gl, canvas }
  }, [])

  useEffect(() => {
    onInit?.(dataRef.current!)
    return () => {
      onDestroy?.(dataRef.current!)
    }
  }, [onInit, onDestroy])

  useEffect(() => {
    let ignore = false
    const render = () => {
      if (!ignore) {
        const { gl, canvas } = dataRef.current!
        const { clientWidth: width, clientHeight: height } = canvas
        if (width) {
          resizeAndClearCanvas(gl, canvas, width, height)
          onRender?.(dataRef.current!)
          requestAnimationFrame(render)
        }
      }
    }
    requestAnimationFrame(render)
    return () => {
      ignore = true
    }
  }, [onRender])

  return (
    <canvas
      ref={canvasRef}
      style={{ ...defaultStyle, ...style }}
      {...rest}
    />
  )
}
