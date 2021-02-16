export declare const ARRAY_LENGTH = 16;
/**
 * Convert the given {string} to a {Uint8Array} value.
 * @param value String value of the Guid.
 */
export declare function stringToUint8Array(value: string): Uint8Array;
/**
 * Convert the given {Uint8Array} to a {string} value.
 *
 * @param value Byte Array value of the Guid.
 */
export declare function uint8ArrayToString(value: Uint8Array): string;
/**
 * Validate that the given value is a valid GUID.
 * @param guid The value to be validated.
 */
export declare function isStringValidGuid(guid: string): boolean;
/**
 * Validate that the given value is a valid GUID.
 * @param guid The value to be validated.
 */
export declare function isUint8ArrayValidGuid(guid: Uint8Array): boolean;
/**
 * Generate a random v4 GUID.
 */
export declare function GenerateGuidV4(): string;
