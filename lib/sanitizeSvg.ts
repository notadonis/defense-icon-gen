import { optimize, Config } from 'svgo';

const svgoConfig: Config = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeUnknownsAndDefaults: false,
        },
      },
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: '(style|class|fill|fill-opacity|stroke-opacity|filter|mask|clip.*|id|data-.*)',
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { fill: 'none' },
          { stroke: 'currentColor' },
          { 'stroke-width': '2' },
          { 'stroke-linecap': 'square' },
          { 'stroke-linejoin': 'miter' },
          { 'stroke-miterlimit': '10' },
          { viewBox: '0 0 24 24' },
        ],
      },
    },
    {
      name: 'sortAttrs',
    },
    {
      name: 'convertPathData',
      params: {
        floatPrecision: 0,
      },
    },
  ],
};


export async function sanitizeSvg(svg: string): Promise<string> {
  try {
    const result = optimize(svg, {
      path: 'icon.svg',
      ...svgoConfig,
    });
    // @ts-ignore
    return (result as any).data as string;
  } catch (error) {
    console.error('Sanitization error', error);
    return svg;
  }
}
