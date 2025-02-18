import { Schema, Document, Model } from 'mongoose';

export interface QueryResult {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

export const paginate = <T extends Document, U extends Model<U>>(schema: Schema<T>): void => {
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.limit] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @param {string} [options.projectBy] - Fields to hide or include (default = '')
   * @returns {Promise<QueryResult>}
   */
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(options.sortBy || '')
      .select(options.projectBy || '');

    if (options.populate) {
      const populateFields = options.populate.split(',');
      populateFields.forEach((field) => query.populate(field));
    }

    const totalResults = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const results = await query;

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
  });
};
