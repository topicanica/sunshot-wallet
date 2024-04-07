import { heliusKeys, HELIUS_QUERY_KEYS } from "../heliusKeys";
import { useQuery } from "react-query";
import { mapApiResponseToGetNftsResponse } from "../../../models/getNftsResponse";
import { MessageType } from "../../../models/message";
import vscode from "../../../constants/vscode";
import http from "../../http";
import axios, { AxiosError } from "axios";

export const useFetchSignatures = (address: string, pageNumber: number) => {
    return useQuery(['assetsByOwner', address, pageNumber], async () => {
      const response = await http.post('', {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: address,
          page: pageNumber,
          limit: 10
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return mapApiResponseToGetNftsResponse(response.data);
    }, {
      staleTime: 1000 * 60 * 10, // Stale for 10 minutes
      onError: (error: any) => {
        const message = axios.isAxiosError(error) ? error.message : error?.message || "Unknown error";
        vscode.postMessage({
          type: MessageType.Error,
          payload: message,
        });
      },
      retry: 2, 
    });
  };