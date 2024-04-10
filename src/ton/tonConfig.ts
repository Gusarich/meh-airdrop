import { getHttpEndpoint } from "@orbs-network/ton-access"
import { TonClient } from "@ton/ton"

export const isTestnet = false

async function _getClient() {
  return new TonClient({
    endpoint: await getHttpEndpoint({
      network: isTestnet ? 'testnet' : 'mainnet',
    }),
  })
}

const clientP = _getClient()

export async function getClient() {
  return clientP
}