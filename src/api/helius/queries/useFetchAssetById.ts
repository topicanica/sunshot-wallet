import { useQuery } from "react-query";
import { MessageType } from "../../../models/message";
import vscode from "../../../constants/vscode";
import http from "../../http";
import axios, { AxiosError } from "axios";
import { mapApiResponseToGetNftsResponse } from "../../../models/getNftsResponse";

export const useFetchAssetById = (id: string) => {
    return useQuery(['assetsByOwner', id], async () => {
      const response = await http.post('', {
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: {
          id: id
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