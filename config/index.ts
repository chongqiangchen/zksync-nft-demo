import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import {zkSync} from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = "f37e1ba95e3fc6f993defe54cf55c59f"

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal ZkSync Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [zkSync] as const
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true
})
