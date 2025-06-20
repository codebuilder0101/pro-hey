import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createPostReactionsFieldPolicy = (): FieldPolicy =>
  cursorBasedPagination(["request", ["post"]]);

export default createPostReactionsFieldPolicy;
