import { useFetchAssetById } from "../api/helius/queries";

interface Props {
  id: string;
}

const NftDetails: React.FC<Props> = ({ id }) => {
  const { data: getNft, isLoading, isError } = useFetchAssetById(id);


  if (isLoading) return <div>Loading...</div>;
  if (isError || !getNft) return <div>Error loading data</div>;

  return (
    <div className="wallet-nft">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>NFT:</div>
          {getNft.nfts.map((item, index) => (
            <div className="nft" key={index}>
              <img
                className="nft-image"
                src={item.imageUrl}
                draggable={false}
                alt=""
              />
              <span className="nft-name">{item.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default NftDetails;
