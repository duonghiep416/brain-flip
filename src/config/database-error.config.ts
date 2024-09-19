export const DatabaseErrorCodes = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
};

export const DatabaseErrorMessages = {
  [DatabaseErrorCodes.UNIQUE_VIOLATION]:
    'Duplicate value violates unique constraint',
  [DatabaseErrorCodes.FOREIGN_KEY_VIOLATION]: 'Foreign key violation',
  [DatabaseErrorCodes.NOT_NULL_VIOLATION]:
    'Null value in column that cannot be null',
};
