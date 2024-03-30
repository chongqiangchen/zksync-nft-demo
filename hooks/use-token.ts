import { PAYMASTER_ADDRESS, TOKEN_ABI, TOKEN_ADDRESS } from "@/constants/contract";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { Contract, BrowserProvider, Wallet, Provider } from "zksync-ethers"
import { ethers } from "ethers";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import usePaymaster from "./use-paymaster";


const useToken = () => {
    const { isConnected, address } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const { paymasterBalance, customData } = usePaymaster();

    const getContract = async () => {
        const ethersProvider = new BrowserProvider((window as any)?.ethereum)
        const signer = await ethersProvider.getSigner();
        const erc20Contract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        return erc20Contract;
    }

    const getTokenMintEstimate = async () => {
        const ethersProvider = new BrowserProvider(walletProvider!)
        const erc20Contract = await getContract();

        const gasEstimate = await erc20Contract.mint.estimateGas(address, ethers.parseEther("1000"));
        const gasPrice = await ethersProvider.getGasPrice();
        const cost = gasPrice * gasEstimate;

        return {
            gas: ethers.formatEther(gasEstimate).toString(),
            gasPrice: ethers.formatEther(gasPrice).toString(),
            cost: ethers.formatEther(cost).toString()
        }
    }

    const { data: tokenBalance, refetch: refetchToken } = useQuery(
        ["token", address],
        async () => {
            const erc20Contract = await getContract();
            const balance = await erc20Contract.balanceOf(address);
            return ethers.formatEther(balance).toString();
        },
        {
            enabled: isConnected,
            refetchInterval: 0
        }
    )

    const {data: allowance, refetch: refetchAllowance} = useQuery(["tokenAllowance", address], async () => {
        const erc20Contract = await getContract();
        const allowance = await erc20Contract.allowance(address, customData.paymasterParams.paymaster);
        return allowance;
    }, {
        enabled: isConnected,
        refetchInterval: 0
    })

    const { data: mintTx, isLoading: isMintLoading, mutateAsync: mint } = useMutation(
        ["mint", address],
        async () => {
            const erc20Contract = await getContract();
            const tx = await erc20Contract.mint(address, ethers.parseEther("1000"), {
                customData: ethers.parseEther(tokenBalance!) > ethers.parseEther("1") ? customData : undefined
            });
            await tx.wait();
            return tx;
        },
        {
            onSuccess: () => {
                refetchToken();
                toast.success("mint 1000 token success");
            },
            onError: (error: any) => {
                console.log(error);
                toast.error(error.message);
            }
        }
    )

    const { 
        data: approvePaymasterTx, 
        isLoading: isApprovePaymasterLoading, 
        mutateAsync: approvePaymaster
    } = useMutation("approve", async () => {
        const erc20Contract = await getContract();
        const tx = await erc20Contract.approve(
            PAYMASTER_ADDRESS,
            ethers.MaxUint256
        );
        await tx.wait();
        return tx;
    }, {
        onSuccess: () => {
            toast.success("approve paymaster success");
            refetchAllowance();
        }
    })

    return {
        tokenBalance,
        refetchToken,
        mint,
        mintTx,
        isMintLoading,
        getTokenMintEstimate,
        isAllowancePaymaster: allowance! > ethers.parseEther("1"),
        approvePaymaster,
        isApprovePaymasterLoading,
        approvePaymasterTx
    }
}

export default useToken;