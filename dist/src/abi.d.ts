declare const XchangeABIv15: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    name?: undefined;
    anonymous?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    anonymous?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: ({
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    } | {
        components: ({
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        } | {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        })[];
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    })[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: ({
        components: ({
            components: ({
                internalType: string;
                name: string;
                type: string;
                components?: undefined;
            } | {
                components: {
                    internalType: string;
                    name: string;
                    type: string;
                }[];
                internalType: string;
                name: string;
                type: string;
            })[];
            internalType: string;
            name: string;
            type: string;
        } | {
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        })[];
        internalType: string;
        name: string;
        type: string;
    } | {
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    })[];
    name: string;
    outputs: ({
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    } | {
        components: ({
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        } | {
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        })[];
        internalType: string;
        name: string;
        type: string;
    })[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    stateMutability: string;
    type: string;
    inputs?: undefined;
    name?: undefined;
    anonymous?: undefined;
    outputs?: undefined;
})[];
declare const forwarder: ({
    inputs: any[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: ({
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    } | {
        internalType: string;
        name: string;
        type: string;
        components?: undefined;
    })[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    stateMutability: string;
    type: string;
    inputs?: undefined;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
})[];
export { XchangeABIv15, forwarder };
