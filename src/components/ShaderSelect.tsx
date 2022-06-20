import React, { CSSProperties } from 'react'
import { shaders } from 'components/DataProvider'
import useData from 'utils/useData'
import { resetStyle } from 'utils/css'

const rootStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  padding: 15,
}

const buttonStyle: CSSProperties = {
  ...resetStyle(),
  padding: 5,
  cursor: 'pointer',
}

export default () => {
  const { onShaderSelect } = useData()
  return (
    <div style={rootStyle}>
      {shaders.map(({ src, label }) => (
        <button
          key={label}
          style={buttonStyle}
          onClick={() => onShaderSelect(src)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
