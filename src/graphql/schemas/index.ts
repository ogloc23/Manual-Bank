import { authTypeDefs } from "./auth";
import { userTypeDefs } from "./user";
import { transactionTypeDefs } from "./transaction";
import { depositTypeDefs } from "./deposit";
import { wireTransferTypeDefs } from "./wireTransfer";
import { charityTypeDefs } from "./charity";
import { loanTypeDefs } from "./loan";
import { billPaymentTypeDefs } from "./billPayment";
import { verificationTypeDefs } from "./verification";
import { notificationTypeDefs } from "./notification";
import { activityLogTypeDefs } from "./activityLog";

export const typeDefs = [
  authTypeDefs,
  userTypeDefs,
  transactionTypeDefs,
  depositTypeDefs,
  wireTransferTypeDefs,
  charityTypeDefs,
  loanTypeDefs,
  billPaymentTypeDefs,
  verificationTypeDefs,
  notificationTypeDefs,
  activityLogTypeDefs,
];
