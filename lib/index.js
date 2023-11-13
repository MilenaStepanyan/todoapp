import { STATUS_CODES as nativeStatusCodes } from "http";
export const STATUS_CODES = Object.fromEntries(Object.entries(nativeStatusCodes).map(([key, value]) => [value.toUpperCase().replace(/\s|-|'/g, "_"), +key]));
