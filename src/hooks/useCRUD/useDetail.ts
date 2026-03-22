import { useState } from 'react';

import type { BaseModel } from '@/models/BaseModel';

export interface UseDetail<Model extends BaseModel> {
  getDetail?: () => Promise<Model | null>;
}

export interface DetailState<Model extends BaseModel> {
  data: Model | null;
  isLoadingDetail: boolean;
  error: Error | null;
}

export const useDetail = <Model extends BaseModel>({ getDetail }: UseDetail<Model>) => {
  const [detailState, setDetailState] = useState<DetailState<Model>>({
    data: null,
    isLoadingDetail: false,
    error: null,
  });

  const handleGetDetail = async () => {
    if (!getDetail) return;

    setDetailState(prev => ({ ...prev, isLoadingDetail: true, error: null }));

    try {
      const result = await getDetail();
      setDetailState(prev => ({ ...prev, data: result }));
    } catch (err) {
      setDetailState(prev => ({ ...prev, error: err instanceof Error ? err : new Error(String(err)) }));
    } finally {
      setDetailState(prev => ({ ...prev, isLoadingDetail: false }));
    }
  };

  return {
    ...detailState,
    handleGetDetail,
  };
};
