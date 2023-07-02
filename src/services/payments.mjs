import repository, { COLLECTIONS } from "#src/services/repository.mjs";

const savePaymentTransactionBecauseOfReferral = async (
  registeredUserId,
  meta,
  paymentType = "referral"
) => {
  return repository.saveDoc(COLLECTIONS.PAYMENTS, {
    registeredUserId,
    amount: 500,
    paymentType,
    meta,
  });
};

const savePaymentTransaction = async (
  registeredUserId,
  stripeCustomerId,
  paymentIntent,
  paymentType
) => {
  return repository.saveDoc(COLLECTIONS.PAYMENTS, {
    registeredUserId,
    amount: paymentIntent.amount,
    paymentIntentId: paymentIntent.id,
    stripeCustomerId,
    paymentType,
  });
};

const fetchPaymentsOfRegisteredUser = (registeredUserId) => {
  return repository.findManyDoc(
    COLLECTIONS.PAYMENTS,
    { registeredUserId },
    { createDate: -1 }
  );
};

const exports = {
  savePaymentTransactionBecauseOfReferral,
  savePaymentTransaction,
  fetchPaymentsOfRegisteredUser,
};
export default exports;
