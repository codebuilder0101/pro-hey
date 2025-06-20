import type { FieldPolicy } from '@apollo/client';
import cursorBasedPagination from '../helpers/cursorBasedPagination';

const createWhoReferencedPostFieldPolicy = (): FieldPolicy =>
  cursorBasedPagination(["request", ["post", "referenceTypes"]]);

export default createWhoReferencedPostFieldPolicy;
