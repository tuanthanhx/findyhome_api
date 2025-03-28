import { PipelineStage, Model, FilterQuery } from 'mongoose';

interface PaginationParams<T> {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  filter?: FilterQuery<T>;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const paginateAggregation = async <T>(
  model: Model<T>,
  pipeline: PipelineStage[],
  { page = 1, limit = 10, sort = {}, filter = {} }: PaginationParams<T>,
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;

  const aggregationPipeline: PipelineStage[] = [
    { $match: filter },
    ...pipeline,
    { $sort: sort },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $unwind: {
        path: '$totalCount',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        data: 1,
        total: { $ifNull: ['$totalCount.count', 0] },
      },
    },
  ];

  const result = await model.aggregate(aggregationPipeline);
  const total = result[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    data: result[0]?.data || [],
    pagination: { total, page, limit, totalPages },
  };
};

export default { paginateAggregation };
