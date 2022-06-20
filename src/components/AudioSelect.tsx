import React, { useCallback, DragEvent, CSSProperties, ChangeEvent } from 'react'
import { resetStyle, stretchStyle } from 'utils/css'
import useData from 'utils/useData'

const dropZoneStyle: CSSProperties = {
  ...stretchStyle(),
  ...resetStyle(),
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
}

const inputStyle: CSSProperties = {
  display: 'none',
}

const id = Math.random().toString()

export default () => {
  const { audioSrc, onAudioSelect } = useData()

  const handleFileSelect = useCallback((files: FileList | null) => {
    const file = files?.[0]
    if (file) {
      onAudioSelect(URL.createObjectURL(file))
    }
  }, [onAudioSelect])

  const handleInputChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.target
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleDrop = useCallback((ev: DragEvent<HTMLLabelElement>) => {
    ev.preventDefault()
    const { files } = ev.dataTransfer
    handleFileSelect(files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((ev: any) => {
    ev.preventDefault()
  }, [])

  return (
    <>
      <input
        id={id}
        type="file"
        style={inputStyle}
        onChange={handleInputChange}
      />
      <label
        htmlFor={id}
        style={dropZoneStyle}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!audioSrc && 'Drop audio file'}
      </label>
    </>
  )
}
