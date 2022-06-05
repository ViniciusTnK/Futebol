type MyError = {
  status: number,
  message: string
};

type MyReturn = {
  error: MyError,
};

export { MyError, MyReturn };
