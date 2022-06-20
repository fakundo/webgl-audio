import React, { createContext, useState, useCallback, useMemo } from 'react'
import barShaderSrc from 'shaders/bar.frag'
import haloShaderSrc from 'shaders/halo.frag'

interface PropTypes {
  children: JSX.Element[] | JSX.Element
}

interface StateType {
  audioSrc?: string,
  fShaderSrc: string,
}

interface ContextType extends StateType {
  onAudioSelect: (audioSrc: string) => void,
  onShaderSelect: (fShaderSrc: string) => void,
}

export const shaders = [
  { src: barShaderSrc, label: 'Bar' },
  { src: haloShaderSrc, label: 'Halo' },
]

const defaultState = {
  audioSrc: undefined,
  fShaderSrc: haloShaderSrc,
}

export const DataContext = createContext<ContextType>(null!)

export default (props: PropTypes) => {
  const { children } = props
  const [state, setState] = useState<StateType>(defaultState)

  const handleAudioSelect = useCallback((audioSrc: string) => {
    setState((prevState) => ({ ...prevState, audioSrc }))
  }, [])

  const handleShaderSelect = useCallback((fShaderSrc: string) => {
    setState((prevState) => ({ ...prevState, fShaderSrc }))
  }, [])

  const value = useMemo(() => ({
    ...state,
    onAudioSelect: handleAudioSelect,
    onShaderSelect: handleShaderSelect,
  }), [state])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
