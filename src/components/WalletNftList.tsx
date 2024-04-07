import { useFetchNfts } from "../api/helius";
import React, { useState } from 'react';

interface Props {
  address: string;
}

const WalletNftList: React.FC<Props> = ({ address }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: getNfts, isLoading, isError } = useFetchNfts("86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY", pageNumber);

  // let navigate = useNavigate();

  // const getNftDetails = (id : string) => {
  //   navigate(`/NftDetails/${id}`)
  // }

  const nextPage = () => {
    setPageNumber(page => page + 1);
  };

  const prevPage = () => {
    setPageNumber(page => Math.max(page - 1, 1));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !getNfts) return <div>Error loading data</div>;

  return (
    <div className="wallet-nft-list">
      <div className="pagination">
        <button onClick={prevPage} disabled={pageNumber === 1}>Previous</button>
        <span>Page {pageNumber}</span>
        <button onClick={nextPage} disabled={isLoading || (getNfts.numberOfPages === 0)}>Next</button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>Mainnet-beta tokens:</div>
          {getNfts.nfts.map((item, index) => (
            <div className="wallet-nft" key={index}>
              <img
                className="wallet-nft-image"
                src={item.imageUrl}
                draggable={false}
                alt=""
              />
              <span className="wallet-nft-name">{item.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};


export default WalletNftList;
