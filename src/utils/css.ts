import { CSSProperties } from 'react'

export const stretchStyle = (): CSSProperties => ({
  position: 'absolute',
  display: 'block',
  height: '100%',
  width: '100%',
  left: 0,
  top: 0,
})

export const resetStyle = (): CSSProperties => ({
  fontFamily: 'monospace',
  background: 'none',
  display: 'block',
  color: 'white',
  fontSize: 16,
  outline: 0,
  padding: 0,
  margin: 0,
  border: 0,
})
