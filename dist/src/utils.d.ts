/// <reference types="node" />
import { ToBufferInputTypes } from "@ethereumjs/util";
export declare function padWithZeroes(hexString: string, targetLength: number): string;
export declare function isNullish(value: any): boolean;
export declare function legacyToBuffer(value: ToBufferInputTypes): Buffer;
export declare function concatSig(v: Buffer, r: Buffer, s: Buffer): string;
export declare function recoverPublicKey(messageHash: Buffer, signature: string): Buffer;
export declare function normalize(input: number | string): string | undefined;
