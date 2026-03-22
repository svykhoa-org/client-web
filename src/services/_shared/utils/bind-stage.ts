import { AppConfig } from '@/constants/AppConfig';

type Stage = 'mock' | 'dev' | 'prod';

interface BindStageOptions<SearchParam, Response> {
  stage: Stage;
  mockFn?: (params: SearchParam) => Promise<Response>;
  devFn?: (params: SearchParam) => Promise<Response>;
  prodFn?: (params: SearchParam) => Promise<Response>;
}

export const bindStage = <SearchParam, Response>({
  stage = 'mock',
  mockFn,
  devFn,
  prodFn,
}: BindStageOptions<SearchParam, Response>) => {
  if (AppConfig.isLocal || stage === 'mock') {
    if (mockFn) return mockFn;
    throw new Error('Mock function is not provided');
  }

  if (stage === 'prod') {
    if (prodFn) return prodFn;
    throw new Error('Production function is not provided');
  }

  if (stage === 'dev') {
    if (devFn) return devFn;
    throw new Error('Development function is not provided');
  }

  throw new Error(`Invalid stage: ${stage}`);
};
