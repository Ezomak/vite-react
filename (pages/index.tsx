import dynamic from "next/dynamic";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
const EzKeyDashboard = dynamic(
  () => import("../components/EzKeyDashboard"),
  { ssr: false },
);

export default function Home() {
  return (
    <ThirdwebProvider
      activeChain="polygon"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
      ]}
    >
      <EzKeyDashboard />
    </ThirdwebProvider>
  );
}
