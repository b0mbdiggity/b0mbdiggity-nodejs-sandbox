/// <reference types="node" />
export type TypedDataV1 = TypedDataV1Field[];
export type TypedDataV1Field = {
    name: string;
    type: string;
    value: any;
};
export declare enum SignTypedDataVersion {
    V1 = "V1",
    V3 = "V3",
    V4 = "V4"
}
export type MessageTypeProperty = {
    name: string;
    type: string;
};
export type MessageTypes = {
    EIP712Domain: MessageTypeProperty[];
    [additionalProperties: string]: MessageTypeProperty[];
};
export type TypedMessage<T extends MessageTypes> = {
    types: T;
    primaryType: keyof T;
    domain: {
        name?: string;
        version?: string;
        chainId?: number;
        verifyingContract?: string;
        salt?: ArrayBuffer;
    };
    message: Record<string, unknown>;
};
export declare const TYPED_MESSAGE_SCHEMA: {
    type: string;
    properties: {
        types: {
            type: string;
            additionalProperties: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                        };
                        type: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
        };
        primaryType: {
            type: string;
        };
        domain: {
            type: string;
        };
        message: {
            type: string;
        };
    };
    required: string[];
};
declare function encodeData(primaryType: string, data: Record<string, unknown>, types: Record<string, MessageTypeProperty[]>, version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4): Buffer;
declare function encodeType(primaryType: string, types: Record<string, MessageTypeProperty[]>): string;
declare function findTypeDependencies(primaryType: string, types: Record<string, MessageTypeProperty[]>, results?: Set<string>): Set<string>;
declare function hashStruct(primaryType: string, data: Record<string, unknown>, types: Record<string, MessageTypeProperty[]>, version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4): Buffer;
declare function hashType(primaryType: string, types: Record<string, MessageTypeProperty[]>): Buffer;
declare function sanitizeData<T extends MessageTypes>(data: TypedMessage<T>): TypedMessage<T>;
declare function eip712DomainHash<T extends MessageTypes>(typedData: TypedMessage<T>, version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4): Buffer;
declare function eip712Hash<T extends MessageTypes>(typedData: TypedMessage<T>, version: SignTypedDataVersion.V3 | SignTypedDataVersion.V4): Buffer;
export declare const TypedDataUtils: {
    encodeData: typeof encodeData;
    encodeType: typeof encodeType;
    findTypeDependencies: typeof findTypeDependencies;
    hashStruct: typeof hashStruct;
    hashType: typeof hashType;
    sanitizeData: typeof sanitizeData;
    eip712Hash: typeof eip712Hash;
    eip712DomainHash: typeof eip712DomainHash;
};
export declare function typedSignatureHash(typedData: TypedDataV1Field[]): string;
export declare function signTypedData<V extends SignTypedDataVersion, T extends MessageTypes>({ privateKey, data, version, }: {
    privateKey: Buffer;
    data: V extends "V1" ? TypedDataV1 : TypedMessage<T>;
    version: V;
}): string;
export declare function recoverTypedSignature<V extends SignTypedDataVersion, T extends MessageTypes>({ data, signature, version, }: {
    data: V extends "V1" ? TypedDataV1 : TypedMessage<T>;
    signature: string;
    version: V;
}): string;
export {};
