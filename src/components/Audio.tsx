import React, { CSSProperties, useEffect, useRef } from 'react'

interface PropTypes {
  src: string
  play: boolean
  onAnalyzerReady: (a: AnalyserNode) => void
}

const style: CSSProperties = {
  display: 'none',
}

export default (props: PropTypes) => {
  const { src, play, onAnalyzerReady } = props
  const audioRef = useRef<HTMLAudioElement>(null!)
  const ctxRef = useRef<AudioContext>()
  const analyzerRef = useRef<AnalyserNode>()

  useEffect(() => {
    const { current: audio } = audioRef
    audio[play ? 'play' : 'pause']()

    if (play && !ctxRef.current) {
      const audioCtx = ctxRef.current = new window.AudioContext()
      const source = audioCtx.createMediaElementSource(audio)
      const analyzer = analyzerRef.current = audioCtx.createAnalyser()

      source.connect(analyzer)
      analyzer.connect(audioCtx.destination)

      onAnalyzerReady(analyzer)
    }
  }, [play, src])

  return (
    <audio
      src={src}
      style={style}
      ref={audioRef}
      crossOrigin="anonymous"
    />
  )
}
