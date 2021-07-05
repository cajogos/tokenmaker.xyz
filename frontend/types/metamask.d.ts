declare interface RequestArguments {
    method: string;
    params?: unknown[] | object;
}

declare interface ConnectInfo {
    chainId: string
}

declare interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

declare interface ProviderMessage {
    type: string;
    data: unknown;
}

declare const ethereum: {
    isMetaMask: boolean,
    networkVersion: string,
    selectedAddress: string|null,
    isConnected(): boolean,
    request: (args: RequestArguments) => Promise<unknown>,
    on: (string, func) => any
};