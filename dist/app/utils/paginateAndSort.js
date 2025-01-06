"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateAndSort = exports.applyFilters = void 0;
const applyFilters = (query, searchText, fields) => {
    if (searchText) {
        const regexPattern = new RegExp(searchText, "i");
        const searchConditions = fields.map((field) => ({
            [field]: regexPattern,
        }));
        query = query.where({ $or: searchConditions });
    }
    return query;
};
exports.applyFilters = applyFilters;
const paginateAndSort = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1, limit = 10, searchText = "", fields = []) {
    const sortField = "createdAt";
    const sortOrder = "desc";
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNumber - 1) * pageSize;
    const countQuery = (0, exports.applyFilters)(query.clone(), searchText, fields);
    const totalCount = yield countQuery.model
        .countDocuments(countQuery.getFilter())
        .exec();
    const results = yield (0, exports.applyFilters)(query, searchText, fields)
        .sort({
        [sortField]: sortOrder === "desc" ? -1 : 1,
        _id: sortOrder === "desc" ? -1 : 1,
    })
        .skip(skip)
        .limit(pageSize)
        .exec();
    const meta = {
        page: pageNumber,
        limit: pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
    };
    return {
        results,
        meta,
    };
});
exports.paginateAndSort = paginateAndSort;
