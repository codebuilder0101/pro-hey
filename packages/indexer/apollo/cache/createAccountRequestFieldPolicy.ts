import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createAccountRequestFieldPolicy = (): FieldPolicy =>
  cursorBasedPagination(["request", ["account"]]);

export default createAccountRequestFieldPolicy;
