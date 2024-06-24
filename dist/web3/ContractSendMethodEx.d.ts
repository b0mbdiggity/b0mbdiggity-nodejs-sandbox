import { ContractSendMethod } from 'web3-eth-contract/types';
export interface ContractSendMethodEx extends ContractSendMethod {
    _method: any;
}
