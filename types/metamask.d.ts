declare interface RequestArguments
{
    method: string;
    params?: unknown[] | object;
}

declare interface ConnectInfo
{
    chainId: string
}

declare interface ProviderRpcError extends Error
{
    code: number;
    data?: unknown;
}

declare interface ProviderMessage
{
    type: string;
    data: unknown;
}

// https://eips.ethereum.org/EIPS/eip-1193#request
declare const ethereum: {
    isMetaMask: boolean,
    chainId: string,
    networkVersion: string,
    selectedAddress: string | null,
    isConnected(): boolean,
    request: (args: RequestArguments) => Promise<any>,
    on: (string, func) => any
};