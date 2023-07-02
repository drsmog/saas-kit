import repository, { COLLECTIONS } from "#src/services/repository.mjs";
import { customAlphabet } from "nanoid";

const upsertRegisteredUser = async (data) => {
  const existingRegisteredUser = await repository.findOneDoc(
    COLLECTIONS.REGISTERED_USERS,
    { email: data.email }
  );

  const savedRegisteredUser = await repository.saveDoc(
    COLLECTIONS.REGISTERED_USERS,
    {
      ...existingRegisteredUser,

      ...data,
      ...(!existingRegisteredUser && {
        invited: true,
        accessRequested: true,
      }),
    }
  );
  if (!existingRegisteredUser) {
    savedRegisteredUser.isNew = true;
    savedRegisteredUser.invited = true;
    savedRegisteredUser.accessRequested = true;
  }
  return savedRegisteredUser;
};

const getRegisteredUserByEmail = async (email) => {
  const existingRegisteredUser = await repository.findOneDoc(
    COLLECTIONS.REGISTERED_USERS,
    { email }
  );
  return existingRegisteredUser;
};

const getRegisteredUserById = async (registeredUserId) => {
  const existingRegisteredUser = await repository.findOneDoc(
    COLLECTIONS.REGISTERED_USERS,
    { _id: registeredUserId }
  );
  return existingRegisteredUser;
};

const getUserByReferralCode = async (referralCode) => {
  return repository.findOneDoc(COLLECTIONS.REGISTERED_USERS, { referralCode });
};

const updateRegisteredUserWithStripeData = async (
  registeredUserId,
  stripeData
) => {
  const existingRegisteredUser = await repository.findOneDoc(
    COLLECTIONS.REGISTERED_USERS,
    { _id: registeredUserId }
  );

  const savedRegisteredUser = await repository.saveDoc(
    COLLECTIONS.REGISTERED_USERS,
    {
      ...existingRegisteredUser,
      ...stripeData,
    }
  );
  return savedRegisteredUser;
};

const exports = {
  upsertRegisteredUser,
  getRegisteredUserByEmail,
  getRegisteredUserById,
  getUserByReferralCode,
  updateRegisteredUserWithStripeData,
};
export default exports;
