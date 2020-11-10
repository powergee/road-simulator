/**
 * Blend two textures
 */

var CustomShader = {

  uniforms: {

    "tDiffuse1": { value: null },
    "tDiffuse2": { value: null },
    "mixRatio": { value: 0.5 },
    "opacity": { value: 1.0 },
    "amount": { value: 0 }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "	vUv = uv;",
    "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader:
    `
    uniform float opacity;
    uniform float mixRatio;

    uniform sampler2D tDiffuse1;
    uniform sampler2D tDiffuse2;

    uniform float amount;

    varying vec2 vUv;

    float random( vec2 p )
    {
      vec2 K1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
        2.665144142690225 // 2^sqrt(2) (Gelfondâ€“Schneider constant)
      );
      return fract( cos( dot(p,K1) ) * 12345.6789 );
    }

    void main() {
    	vec4 texel1 = texture2D( tDiffuse1, vUv );
      vec4 texel2 = texture2D( tDiffuse2, vUv );
      vec4 color = opacity * mix( texel1, texel2, mixRatio );
      vec2 uvRandom = vUv;
      uvRandom.y *= random(vec2(uvRandom.y,amount));
      uvRandom.x *= random(vec2(uvRandom.x,amount));
      color.rgb += random(uvRandom)*0.08;
      gl_FragColor = vec4( color );
    }
    `
};

export { CustomShader };
