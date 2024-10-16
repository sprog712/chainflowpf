// StakeToken.tsx

'use client';

import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { approve, balanceOf } from "thirdweb/extensions/erc20";
import { REWARD_TOKEN_CONTRACT, STAKE_TOKEN_CONTRACT, STAKING_CONTRACT } from "../utils/contracts";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { useEffect, useState } from "react";
import { client } from "@/app/client";
import { chain } from "@/app/chain";

export const StakeToken = () => {
    const account = useActiveAccount();

    const [stakeAmount, setStakeAmount] = useState(0);
    const [stakingState, setStakingState] = useState("init");
    const [isStaking, setIsStaking] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [isWithdrawing, setIsWithdrawing] = useState(false); // Mantener esta variable

    // Cargar el balance del token de staking
    const { data: stakingTokenBalance, isLoading: loadingStakeTokenBalance, refetch: refetchStakingTokenBalance } = useReadContract(
        balanceOf,
        {
            contract: STAKE_TOKEN_CONTRACT,
            address: account?.address || "",
            queryOptions: {
                enabled: !!account,
            }
        }
    );

    // Cargar el balance del token de recompensa
    const { data: rewardTokenBalance, isLoading: loadingRewardTokenBalance, refetch: refetchRewardTokenBalance } = useReadContract(
        balanceOf,
        {
            contract: REWARD_TOKEN_CONTRACT,
            address: account?.address || "",
            queryOptions: {
                enabled: !!account,
            }
        }
    );

    // Obtener información de staking
    const { data: stakeInfo, refetch: refetchStakeInfo } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address as string],
        queryOptions: {
            enabled: !!account,
        }
    });

    // Refrescar datos cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            refetchData();
        }, 10000);
        return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
    }, [account]); // Asegurarse de que se refresque al cambiar de cuenta

    const refetchData = () => {
        refetchStakeInfo();
        refetchStakingTokenBalance();
        refetchRewardTokenBalance();
    };

    return (
        <div>
            {account && (
                <div style={{
                    backgroundColor: "#151515",
                    padding: "40px",
                    borderRadius: "10px",
                }}>
                    <ConnectButton
                        client={client}
                        chain={chain}
                    />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "20px",
                    }}>
                        {/* Mostrar balance del token de staking */}
                        <p>
                            Staking Token: 
                            {loadingStakeTokenBalance 
                                ? " Loading..." 
                                : stakingTokenBalance 
                                    ? toEther(stakingTokenBalance).toString() 
                                    : "No Balance"
                            }
                        </p>
                        {/* Mostrar balance del token de recompensa */}
                        <p>
                            Reward Token: 
                            {loadingRewardTokenBalance 
                                ? " Loading..." 
                                : rewardTokenBalance 
                                    ? toEther(rewardTokenBalance).toString() 
                                    : "No Balance"
                            }
                        </p>
                    </div>

                    {stakeInfo && (
                        <div>
                            <div>
                                <p>Balance Staked: {toEther(stakeInfo[0]).toString()}</p>
                                <p>Reward Balance: {toEther(stakeInfo[1]).toString()}</p>
                            </div>
                            <TransactionButton
                                transaction={() => (
                                    prepareContractCall({
                                        contract: STAKING_CONTRACT,
                                        method: "claimRewards",
                                    })
                                )}
                                onTransactionConfirmed={() => {
                                    refetchData();
                                    refetchStakingTokenBalance();
                                    refetchRewardTokenBalance();
                                }}
                            >Claim Rewards</TransactionButton>
                        </div>
                    )}

                    <div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsStaking(false);
                                    setStakeAmount(0);
                                    setStakingState("init");
                                }}
                            >Close</button>
                            <h3>Stake</h3>
                            <p>Balance: {stakingTokenBalance ? toEther(stakingTokenBalance).toString() : "Loading..."}</p> {/* Manejo de estado de carga */}
                            {stakingState === "init" ? (
                                <>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        value={stakeAmount}
                                        onChange={(e) => setStakeAmount(parseFloat(e.target.value))}
                                    />
                                    <TransactionButton
                                        transaction={() => (
                                            approve({
                                                contract: STAKE_TOKEN_CONTRACT,
                                                spender: STAKING_CONTRACT.address,
                                                amount: stakeAmount,
                                            })
                                        )}
                                        onTransactionConfirmed={() => setStakingState("approved")}
                                    >Set Approval</TransactionButton>
                                </>
                            ) : (
                                <>
                                    <h3>{stakeAmount}</h3>
                                    <TransactionButton
                                        transaction={() => (
                                            prepareContractCall({
                                                contract: STAKING_CONTRACT,
                                                method: "stake",
                                                params: [toWei(stakeAmount.toString())],
                                            })
                                        )}
                                        onTransactionConfirmed={() => {
                                            setStakeAmount(0);
                                            setStakingState("init");
                                            refetchData();
                                            refetchStakingTokenBalance();
                                            setIsStaking(false);
                                        }}
                                    >Stake</TransactionButton>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsWithdrawing(false); // Esto es para cerrar la ventana de retiro
                                }}
                            >Close</button>
                            <h3>Withdraw</h3>
                            <input
                                type="number"
                                placeholder="0.0"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                            />
                            <TransactionButton
                                transaction={() => {
                                    setIsWithdrawing(true); // Cambiar el estado a retirando
                                    return prepareContractCall({
                                        contract: STAKING_CONTRACT,
                                        method: "withdraw",
                                        params: [toWei(withdrawAmount.toString())],
                                    });
                                }}
                                onTransactionConfirmed={() => {
                                    setWithdrawAmount(0);
                                    refetchData();
                                    refetchStakingTokenBalance();
                                    setIsWithdrawing(false); // Cambiar el estado a no retirando
                                }}
                            >Withdraw</TransactionButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

