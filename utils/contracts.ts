import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { STAKING_CONTRACT_ABI } from "./stakingContractABI";

// Replace <contract_address> with the contract address of your contract
const stakeTokenContractAddress = "0x99B70c3bAbC6a0CCF86EC61A6c165Fbb07B89f1C";
const rewardTokenContractAddress = "0x0008a835dcD39ede74fBcf127828C905BA337d26";
const stakingContractAddress = "0x924901d99687Fe53d0157a0946475b058abd78fe";

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