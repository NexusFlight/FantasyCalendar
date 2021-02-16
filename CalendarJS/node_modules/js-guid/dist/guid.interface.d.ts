export interface IGuid {
    /**
     * Returns the string format of the Guid.
     */
    toString(): string;
    /**
     * Returns the Uint8Array of the Guid.
     */
    toByteArray(): Uint8Array;
    /**
     * Compare the Given value with the current Guid.
     */
    equals(value: IGuid | string | Uint8Array): boolean;
    /**
     * Return {True} if the Guid holds an empty value, False otherwise.
     */
    isEmpty(): boolean;
}
