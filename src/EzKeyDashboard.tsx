import {
  useAddress,
  useContract,
  useContractRead,
  Web3Button,
} from "@thirdweb-dev/react";

const EZKEY_ADDR =
  "0xbca0C59Ee51CaA9837EA2f05d541E9936738Ce6b"; // Adresse NFT Ez-Key V2 sur Polygon

export default function EzKeyDashboard() {
  const address = useAddress();
  const { contract } = useContract(
    EZKEY_ADDR,
    "nft-collection",
  );

  // Récupère le tokenId (si 1 NFT par wallet, c'est 0 ou le premier trouvé)
  const { data: tokenId } = useContractRead(
    contract,
    "tokenOfOwnerByIndex",
    [address, 0],
  );
  const { data: holderData } = useContractRead(
    contract,
    "holders",
    [address],
  );
  const { data: tokenUri } = useContractRead(
    contract,
    "tokenURI",
    [tokenId],
  );
  const LEVEL = ["Bronze", "Silver", "Gold"];

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
      <h2>Ma Ez-Key NFT</h2>
      {tokenId !== undefined ? (
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
            <b>Niveau :</b> {LEVEL[holderData?.level || 0]}
          </p>
          <p>
            <b>Dernier claim :</b>{" "}
            {holderData?.lastClaim
              ? new Date(
                  Number(holderData.lastClaim) * 1000,
                ).toLocaleString()
              : "Jamais"}
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
            action={(contract) => contract.call("mintKey")}
          >
            Mint Ez-Key
          </Web3Button>
        </>
      )}
    </div>
  );
}
