import { createThirdwebClient } from 'thirdweb';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export const client = createThirdwebClient({
    clientId: "ea228c4855abc1c8dd56330f43162de4" ,
});
