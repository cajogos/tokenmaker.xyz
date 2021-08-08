export default interface IMetaMaskListener
{
    onAccountChanged(account: string | null): void;
    onNetworkChanged(network: number | null): void;
}
