precision lowp float;

uniform vec2 u_resolution;
uniform float u_audio[16];

float getAudioData(int index) {
  for(int i = 0; i < 16; i++) {
    if(i == index) {
      return u_audio[i];
    }
  }
}

void main() {
  float barIndex = gl_FragCoord.y * 16. / u_resolution.y;
  float barValue = getAudioData(int(barIndex)) / 256.;
  gl_FragColor = vec4(1, barValue, 0, 1);
}
