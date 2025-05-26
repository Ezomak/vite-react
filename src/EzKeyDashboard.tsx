import {
  useAddress,
  useContract,
  useContractRead,
  Web3Button,
  ConnectWallet,
} from "@thirdweb-dev/react";

const EZKEY_ADDR =
  "0xbca0C59Ee51CaA9837EA2f05d541E9936738Ce6b"; // Adresse NFT Ez-Key V2 sur Polygon

const LEVELS = ["Bronze", "Silver", "Gold"];

export default function EzKeyDashboard() {
  const address = useAddress();
  // Utilise le typage "custom" pour accéder à toutes les fonctions/mappings
  const { contract } = useContract(EZKEY_ADDR, "custom");
  // Récupère le tokenId du holder (0 si 1 NFT max, sinon adapter pour plusieurs)
  const { data: tokenId } = useContractRead(
    contract,
    "tokenOfOwnerByIndex",
    [address, 0],
  );
  // Plug la structure holders (public mapping du smart contract, via ABI)
  const { data: holderData } = useContractRead(
    contract,
    "holders",
    [address],
  );
  // Récupère la metadata/image dynamique selon le niveau
  const { data: tokenUri } = useContractRead(
    contract,
    "tokenURI",
    [tokenId],
  );

  // Pour affichage nice du timer (seconds -> date/heure lisible)
  const formattedDate = (ts?: string | number) =>
    ts && Number(ts) > 0
      ? new Date(Number(ts) * 1000).toLocaleString()
      : "Jamais";

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #CCC",
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <ConnectWallet />
      <h2>Ma Ez-Key NFT</h2>
      {address ? (
        tokenId !== undefined && tokenId !== null ? (
          <>
            <img
              src={tokenUri}
              alt="Ez-Key NFT"
              style={{
                width: 256,
                height: 256,
                margin: "0 auto 16px",
              }}
            />
            <p>
              <b>Niveau&nbsp;:</b>{" "}
              {LEVELS[holderData?.level || 0]}
            </p>
            <p>
              <b>Dernier claim&nbsp;:</b>{" "}
              {formattedDate(holderData?.lastClaim)}
            </p>
            <Web3Button
              contractAddress={EZKEY_ADDR}
              action={(contract) =>
                contract.call("claimReward")
              }
              style={{ marginTop: 10 }}
            >
              Claim Reward
            </Web3Button>
            <Web3Button
              contractAddress={EZKEY_ADDR}
              action={(contract) =>
                contract.call("upgradeToSilver")
              }
              style={{ marginTop: 10 }}
            >
              Upgrade Silver
            </Web3Button>
            <Web3Button
              contractAddress={EZKEY_ADDR}
              action={(contract) =>
                contract.call("upgradeToGold")
              }
              style={{ marginTop: 10 }}
            >
              Upgrade Gold
            </Web3Button>
          </>
        ) : (
          <>
            <p>Vous ne possédez pas encore d’Ez-Key NFT.</p>
            <Web3Button
              contractAddress={EZKEY_ADDR}
              action={(contract) =>
                contract.call("mintKey")
              }
            >
              Mint Ez-Key
            </Web3Button>
          </>
        )
      ) : (
        <p>Connecte ton wallet pour accéder à la Ez-Key.</p>
      )}
    </div>
  );
}

