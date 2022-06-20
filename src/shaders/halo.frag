precision lowp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audio[16];

float random(in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

    // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
    (c - a) * u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm(in vec2 _st) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for(int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(_st);
    _st = rot * _st * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

float clampZeroOne(float x) {
  return clamp(x, 0., 1.);
}

float invertValue(float x) {
  return clampZeroOne(x) * -1. + 1.;
}

vec3 getAudioAverage() {
  float total = 0.;
  float low = 0.;
  float high = 0.;
  for(int i = 0; i < 16; i++) {
    total += u_audio[i];
    if(i < 8) {
      low += u_audio[i];
    } else {
      high += u_audio[i];
    }
  }
  return vec3(total / 16., low / 8., high / 8.) / 256.;
}

void main() {
  const float speed = 8000.;
  const float speed2 = 2000.;

  float tm = u_time / speed;
  float tm2 = u_time / speed2;
  vec3 avg = getAudioAverage();

  float size = 1.5 - avg.y / 2.5;
  float minSide = min(u_resolution.x, u_resolution.y);
  vec2 coord = gl_FragCoord.xy / minSide * size;
  coord -= vec2(size * .5) / vec2(minSide / u_resolution.x, minSide / u_resolution.y);
  float noiseX = noise(coord * 2. + tm2 + 100.);
  float noiseY = noise(coord * 2. - tm2);
  coord *= vec2(noiseX, noiseY) / 2. + 1.;
  vec2 coordEllipse = coord * vec2(0.98, .6);

  float ellipse = clampZeroOne(dot(coordEllipse, coordEllipse));
  float maskEllipse = invertValue(ellipse / .06 - 1.4);
  bool isOutsideMask = maskEllipse == 0.;

  if(isOutsideMask) {
    gl_FragColor = vec4(0, 0, 0, 1);
    return;
  }

  float circle = clampZeroOne(dot(coord, coord));

  float maskRingInner = invertValue(circle / .08 - 1.8) - invertValue(circle / .05 - 2.);
  float maskRingOuter = invertValue(circle / .18 - .8) - invertValue(circle / .05 - 1.8);

  float ringInner = maskEllipse * maskRingInner;
  ringInner -= fbm(vec2(circle) * fbm(coord * avg.z + tm) * (100. + avg.z * 50.) + tm);

  float ringOuter = maskEllipse * maskRingOuter;
  ringOuter -= noise(coord * 2. + tm2) * 1.3;

  float figure = clampZeroOne(ringInner) + clampZeroOne(ringOuter);

  vec3 topColor = vec3(1, 0, 0);
  vec3 middleColor = vec3(0, 0, 1);
  vec3 bottomColor = vec3(0, 1, 0);

  vec3 color = mix(middleColor, topColor, coord.y * size * 1.3);
  color = mix(color, bottomColor, -coord.y * size * 1.3);
  color *= mix(.6, 3., avg.z);
  color *= figure;

  gl_FragColor = vec4(color, 1);
}
