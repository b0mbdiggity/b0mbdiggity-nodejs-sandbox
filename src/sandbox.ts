import { parseForCMP, parseForPDMP } from "./work/uptn-asset";

const sandbox = async () => {
  await parseForPDMP();
  // await parseForCMP();
};

sandbox();
