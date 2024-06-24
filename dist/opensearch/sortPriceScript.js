"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortPriceScript = `
  double usdPrice = 0;
  double marketPrice = 0;

  if(params._source.order != null && params._source.order.sale != null && params._source.order.sale.price != null){
    marketPrice = params._source.order.sale.price;

    usdPrice = params._source.order.sale.currency == 'MATIC'
    ? marketPrice * params.MATIC
    : params._source.order.sale.currency == 'PLA'
      ? marketPrice * params.PLA
      : params._source.order.sale.currency == 'ETH' || params._source.order.sale.currency == 'WETH'
        ? marketPrice * params.ETH
        : marketPrice
  } else {
    usdPrice = params.sort == 'asc' ? 999999 : 0
  }

  return usdPrice;
`;
exports.default = sortPriceScript;
//# sourceMappingURL=sortPriceScript.js.map