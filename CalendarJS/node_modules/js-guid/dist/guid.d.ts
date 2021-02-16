/**
 * BASED ON SOURCE: https://www.jocys.com/common/jsclasses/documents/Default.aspx?File=System.debug.js&Item=System.Guid&Index=2
 */
import { IGuid } from './guid.interface';
export declare class Guid implements IGuid {
    /**
     * Empty string Guid value: '00000000-0000-0000-0000-000000000000'.
     */
    static EMPTY: string;
    /**
     * Holds a Uint8Array of 16 elements containing the GUID values.
     */
    private BytesGuid;
    /**
     * Holds the string value of the GUID.
     */
    private StringGuid;
    /**
     * Create a new instance of the Guid with the given value,
     * or generate a new Guid if no value was given.
     * @param value The target value if already exists, leave it empty for a new value.
     */
    constructor(value?: string | Uint8Array | undefined);
    toString(): string;
    toByteArray(): Uint8Array;
    equals(value: IGuid | string | Uint8Array): boolean;
    isEmpty(): boolean;
    /**
     * Parse the given value into the opposite type.
     * Example : if value is string the function return a {Uint8Array of 16 elements},
     * otherwise it return a {string} if the value is a Uint8Array.
     */
    static parse(value: string | Uint8Array): string | Uint8Array;
    /**
     * Generate a new v4 Guid and return a new instance of the Guid.
     */
    static newGuid(): Guid;
    /**
     *  Checks if the given value is a valid GUID.
     * @param value The given guid that need to be validated.
     */
    static isValid(value: string | Uint8Array): boolean;
}
