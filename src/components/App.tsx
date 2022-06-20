import React from 'react'
import DataProvider from 'components/DataProvider'
import Player from 'components/Player'
import AudioSelect from 'components/AudioSelect'
import ShaderSelect from 'components/ShaderSelect'

export default () => {
  return (
    <DataProvider>
      <Player />
      <AudioSelect />
      <ShaderSelect />
    </DataProvider>
  )
}
