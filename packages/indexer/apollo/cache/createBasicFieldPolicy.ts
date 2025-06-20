import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createBasicFieldPolicy = (): FieldPolicy =>
  cursorBasedPagination(["request", ["filter", "pageSize"]]);

export default createBasicFieldPolicy;
