"use client";

import { TOKEN_ADDRESS } from "@/constants/contract";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import useToken from "@/hooks/use-token";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import Checkout from "./checkout";
import { ethers } from "ethers";

const MintTokenModal = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const {
        tokenBalance,
        getTokenMintEstimate,
        mint,
        isMintLoading,
        isAllowancePaymaster,
        approvePaymaster,
        isApprovePaymasterLoading
    } = useToken();

    const {
        data: tokenMintEstimate,
        isLoading: isTokenMintEstimateLoading
    } = useQuery("tokenMintEstimate", getTokenMintEstimate, {
        enabled: openModal
    })

    const nonGas = useMemo(
        () => tokenBalance ? ethers.parseEther(tokenBalance!) > ethers.parseEther("1") : false,
        [tokenBalance]
    )

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger>
                <a className="text-blue-600">Mint</a>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>领取支付代币 {nonGas && "(无GAS版)"}</DialogTitle>
                    <DialogDescription>用于支付手续费的代币</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mb-4">
                    <div className="text-sm">代币合约地址：{TOKEN_ADDRESS}</div>
                    <div className="text-sm">当前账户代币余额：{tokenBalance || 0} WTF</div>
                    <Checkout
                        gas={tokenMintEstimate?.gas}
                        gasPrice={tokenMintEstimate?.gasPrice}
                        cost={tokenMintEstimate?.cost}
                        nonGas={nonGas}
                        transaction="Mint (amount = 1000 WTF)"
                    />
                </div>
                <DialogFooter>
                    {!isAllowancePaymaster ? (
                        <Button
                            size="sm"
                            className="w-full"
                            disabled={isApprovePaymasterLoading}
                            onClick={() => approvePaymaster()}
                        >Approve Paymaster</Button>
                    ) : (
                        <Button
                            size="sm"
                            className="w-full"
                            disabled={isMintLoading}
                            onClick={() => mint()}
                        >开始执行</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MintTokenModal;