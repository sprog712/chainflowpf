import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { STAKING_CONTRACT_ABI } from "./stakingContractABI";

// Replace <contract_address> with the contract address of your contract
const stakeTokenContractAddress = "0xdCA5EbAC828f656895Bf60a5F7b2Fa27E6Bd64d4";
const rewardTokenContractAddress = "0x60CBf2F1B21FB8A47b25E1B17EB6B78c1E6Ca320";
const stakingContractAddress = "0x6ca781Bff4B42A99b0Ecd78BB615D94336fA8E95";

export const STAKE_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakeTokenContractAddress,
});

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress,
});


export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: STAKING_CONTRACT_ABI
});