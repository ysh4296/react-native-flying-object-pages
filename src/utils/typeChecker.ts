export const assertUnreachableChecker = (x: never): never => {
  throw new Error(`Unexpected value: ${x}`);
};
