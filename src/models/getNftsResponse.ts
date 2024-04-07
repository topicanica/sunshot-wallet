export interface GetNftsResponse {
  numberOfPages: number;
  nfts: [
    {
      name: string;
      id: string;
      tokenAddress: string;
      collectionAddress: string;
      collectionName: string;
      imageUrl: string;
      traits: NftTrait[];
    }
  ];
}

export const defaultGetNftsResponse: GetNftsResponse = {
  numberOfPages: 0,
  nfts: [
    {
      name: "",
      id: "",
      tokenAddress: "",
      collectionAddress: "",
      collectionName: "",
      imageUrl: "",
      traits: [],
    },
  ],
};

interface NftTrait {
  trait_type: string;
  value: string;
}

export const mapApiResponseToGetNftsResponse = (data: any): GetNftsResponse => {
  if (!data || !data.result || !data.result.items) {
    return defaultGetNftsResponse;
  }

  let numberOfPages = 0;
  if (data.result.total === data.result.limit) {
    numberOfPages = 1;
  }
  
  return {
    numberOfPages: numberOfPages,
    nfts: data.result.items.map((item: any) => ({
      name: item.content?.metadata?.name || "",
      id: item.id || "",
      tokenAddress: item.id || "",
      //collectionAddress: item.content?.metadata?.symbol || "",
      //collectionName: item.content?.metadata?.token_standard || "",
      imageUrl: item.content?.links?.image || "",
      traits: (item.content?.metadata?.attributes || []).map((attribute: any) => ({
        trait_type: attribute.trait_type || "",
        value: attribute.value || "",
      })),
    })),
  };
};