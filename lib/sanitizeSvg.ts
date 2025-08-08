import { optimize } from 'svgo';
import svgoConfig from '../svgo.config.mjs';

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
