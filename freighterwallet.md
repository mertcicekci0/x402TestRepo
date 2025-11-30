Connect to the Testnet
Install the Freighter browser extension.

Create a keypair or import an existing account using a mnemonic phrase to complete setup.

Next, switch to Testnet. Testnet is available from the network dropdown.

If your account does not exist on the selected network, Freighter will prompt you to fund it the account using Friendbot. Alternatively, you can do so in the Stellar Lab.

-

Integrate Freighter with a React dapp
Wallets are an essential part of any dapp. They allow users to interact with the blockchain and sign transactions. In this section, you'll learn how to integrate the Freighter wallet into your React dapps.

WalletData Component
In the example crowdfund dapp, the WalletData component plays a key role in wallet integration. Let's break down the code and understand its functionality:

/components/moleculres/wallet-data/index.tsx
import React from "react";
import { useAccount, useIsMounted } from "../../../hooks";
import { ConnectButton } from "../../atoms";
import styles from "./style.module.css";

export function WalletData() {
  const mounted = useIsMounted();
  const account = useAccount();

  return (
    <>
      {mounted && account ? (
        <div className={styles.displayData}>
          <div className={styles.card}>{account.displayName}</div>
        </div>
      ) : (
        <ConnectButton label="Connect Wallet" />
      )}
    </>
  );
}


Here's a breakdown of the code:

The mounted variable is obtained using the useIsMounted hook, indicating whether the component is currently mounted or not.
The useAccount hook is used to fetch the user's account data, and the data property is destructured from the result.
Conditional rendering is used to display different content based on the component's mount status and the availability of account data.
If the component is mounted and the account data is available, the user's wallet data is displayed. This includes the account's display name.
If the component is not mounted or the account data is not available, a ConnectButton component is rendered, allowing the user to connect with Freighter.

-

Send Soroban token payments
Once you have added a Soroban token to your Freighter wallet, you can now send a payment of that token directly from Freighter.

On the Freighter account screen, click the Send icon in the upper part of the screen.

Enter a recipient public key. Click Continue.

Select your token from the asset list at the bottom of the screen and enter a token amount. Click Continue.

Enter a memo (optional). Click Review Send.

Review the details of your payment. Click Send.

-

Sign Soroban XDRs
With a funded Testnet account, you can now sign Soroban XDRs using dApps that are integrated with Freighter. An example of an integrated dApp is Stellar's Lab.

On the Lab's transaction signer, enter a Soroban XDR into the form field.

Click Sign with Freighter.

Freighter will open with the details of the XDR. Click Approve to sign or Reject to dismiss without a signature.

If approved, Freighter will transmit a signed XDR back to the Lab.

-

Enable Soroban tokens
With a funded Stellar account, you can now add Soroban tokens to your Freighter wallet.

On the Freighter account screen, click this Manage assets button in the ... options dropdown in the top left of the screen.

You will now see a button to Add an asset at the bottom of the screen. Click this Add an asset button.

On the next screen, enter the Token ID of the token you want to add to Freighter and click the Add button when it appears. Click Confirm to add it to your wallet.

You will now see your token's balance on Freighter's account page. Clicking on the balance will show a history of payments sent using this token.

-

Prompt Freighter to sign transactions as a JS dapp developer
If you're building a JS dapp, easily sign Soroban transactions using the Freighter browser extension and its corresponding client library @stellar/freighter-api:

Follow the setup instructions to connect to the Testnet, if required during development.

Now, you can use the signTransaction method from @stellar/freighter-api in your dapp to sign Soroban XDRs using the account in Freighter.

Upon calling signTransaction, Freighter will open and prompt the user to sign the transaction. Approving the transaction will return an object containing the signed XDR to the requesting dapp.

-

Sign authorization entries
In order to take advantage of contract authorization, you can use Freighter's API to sign an authorization entry. A good example of how signing an authorization entry works can be found in the authorizeEntry helper of stellar-sdk.

Like in the helper, you can construct a HashIdPreimageSorobanAuthorization and use the xdr representation of that structure to call await freighterApi.signAuthEntry(preimageXdr). This call will return a Buffer of the signed hash of the HashIdPreimageSorobanAuthorization passed in, which can then be used to submit to the network during a contract authorization workflow.
