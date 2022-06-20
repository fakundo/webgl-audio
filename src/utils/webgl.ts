export const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compilation error: ${log}`)
  }
  return shader
}

export const createProgram = (gl: WebGLRenderingContext, vShaderSrc: string, fShaderSrc: string) => {
  const program = gl.createProgram()!
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vShaderSrc))
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fShaderSrc))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Program linking error: ${log}`)
  }
  return program
}

export const resizeAndClearCanvas = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement, width: number, height: number) => {
  const ratio = window.devicePixelRatio || 1
  const w = width * ratio
  const h = height * ratio
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, w, h)
  }
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
