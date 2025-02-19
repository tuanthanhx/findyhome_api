import Counter from './counter.model';

const getNextReferralId = async (): Promise<number> => {
  const initialValue = 1000000;

  const counter = await Counter.findOneAndUpdate(
    { name: 'referralId' },
    { $inc: { value: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  // If a new document was inserted, set the initial value
  if (Number(counter?.value) === 1) {
    await Counter.updateOne({ name: 'referralId' }, { value: initialValue });
    return initialValue;
  }

  return counter?.value ? Number(counter?.value) : initialValue;
};

export default { getNextReferralId };
