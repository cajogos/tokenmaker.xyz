export default interface IMetaMaskListener
{
    handleAccountChangedEvent(account: string | null): void;
    handleNetworkChangedEvent(network: number | null): void;
}