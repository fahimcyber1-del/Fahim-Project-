import { AQL_TABLE } from './aqlData';

export const calculateAQL = (orderQuantity: number, aqlLevel: string) => {
  const row = AQL_TABLE.find(item => orderQuantity >= item.lotMin && orderQuantity <= item.lotMax);
  if (!row) return { sampleSize: 0, ac: 0, re: 0 };
  
  const aqlData = row.aql[aqlLevel as unknown as keyof typeof row.aql];
  return {
    sampleSize: row.sampleSize,
    ...aqlData
  };
};
