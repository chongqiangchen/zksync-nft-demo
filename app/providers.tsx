'use client'

import React, {ReactNode} from 'react'
import {config, projectId} from '@/config'
import {createWeb3Modal} from '@web3modal/wagmi/react'
import {State, WagmiProvider} from 'wagmi'
import {zkSync} from "wagmi/chains";

// Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    defaultChain: zkSync,
})

export default function Providers(
    {
        children,
        initialState
    }: {
        children: ReactNode
        initialState?: State
    }
) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            {children}
        </WagmiProvider>
    )
}
