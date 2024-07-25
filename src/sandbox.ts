const sandbox = () => {
  console.log();

  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

  type Func = () => number;

  type FuncReturnType = ReturnType<Func>; // number
};

sandbox();
