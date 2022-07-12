import { DEPLOY_STATUS } from "./schemas/deploy.schema";

export class TicketSubmitDto {
  code: string;
  email: number;
  accountHash: string;
}

export class CreateDeployDto {
  hash: string;
  publicKey: string;
  nftId: string;
  status?: DEPLOY_STATUS; 
}
