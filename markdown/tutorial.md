# How to create your own ERC20 Token on Ethereum

Follow this tutorial on how to create your own ERC20 token on the Ethereum network using this website.

### Requirements

The following is a list of requirements that you must meet before you are able to create your very own cryptocurrency.

- You must have a [MetaMask wallet](https://metamask.io/) with the extension installed in your browser.
- You must have some ETH in your wallet in order to cover the transaction fees.
  - You are advised to first deploy your token on a testnet (such as Ropsten) until you are completely happy with the result.
  - You can get test ETH for free [from a faucet](https://faucet.metamask.io/) for the network you are currently using.
- **You must agree that any token created using this tool is of your own responsibility and liability.**
  - This website is only used as a tool to create your token - the supply will be completely moved to your own personal wallet.

---

## Getting Started

#### 1. Install MetaMask

- You must first [install MetaMask browser extension](https://metamask.io/download.html).
- *The tool does not currently support Mobile wallets or any other wallet providers. This may be included in future releases.*

#### 2. Connect to your Wallet

- Once you have installed MetaMask you need to connect to your wallet.
- Do this by pressing the **Connect Wallet** on the header of the website.
- **You have to allow for this website to connect and read your MetaMask information**.
  - This is completely safe and is only used to inform you of the currently selected account and network.

#### 3. Choose your account and network

- You must be careful when choosing the account and network.
  - This is however going to be displayed at all stages of the deployment process before you commit to pay for the contract deployment.
- If you just want to test creating a contract: choose a testnet network and an account with test ETH.
  - You can get some test ETH [from a faucet](https://faucet.metamask.io/).

#### 4. Enter your ERC20 Token Details

- Enter the details for your token:
  - Enter a suitable name for your token.
    - *Try to be clear and professional as this will be visible by any of your token holders.*
  - Enter a symbol for your token.
    - *This will always be in capitals and it is recommended for it to not be longer than 5 characters and to not start with a number.*
  - Enter the total supply of your token.
    - *This total number of tokens will be sent directly to your wallet once it's deployed.*
- Once you are happy with your token details hit **Confirm Details**.

#### 5. Deploy your new token

- **Once your contract compiles** you will be presented with some technical information about your token.
  - This is for debugging purposes and it can usually be disregarded.
- **Confirm you are using the correct account and network in your MetaMask wallet**.
  - This information can also be seen in the header of the website.
- Press the **Deploy Contract** button and confirm the transaction fees for contract creation in your MetaMask wallet.
- **!! Wait a few minutes for the contract to be deployed !!**
  - Based on network congestion this can take a few minutes.
  - Check your MetaMask wallet for status of the deployment. It should say _"Pending"_.
- Once the contract is deployed you will be presented with:
  - The contract address.
  - A **Add to Wallet** button to easily add the token to your MetaMask wallet.
- If you use one of the public testnets you should also be able to see the new token information on [Etherscan](https://etherscan.io).

#### 6. Send tokens to anyone

- Once the token is deployed you can now add it to your MetaMask wallet and send it around to anyone with an Ethereum address.
- Make sure to give them the token address so that it displays on their wallets too.
- Be careful that this also costs ETH gas fees.
  - It is recommended you plan ahead and hold a substantial amount of ETH before you run an airdrop.
