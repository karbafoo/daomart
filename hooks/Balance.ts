import {BaseProvider} from '@ethersproject/providers';
import {Contract, ethers} from 'ethers';
import React from 'react';

const useGetBalance = (addr: string, provider: BaseProvider) => {
    const [balance, setbalance] = React.useState('');
    React.useMemo(async () => {
        if (addr && provider) {
            try {
                let a = Number(await provider.getBalance(addr)) / 1e18;
                let b = parseFloat(a.toString()).toFixed(2);
                setbalance(b);
            } catch (error) {}
        } else {
            setbalance('');
        }
    }, [addr, provider]);
    return balance;
};
const useGetNFKBalance = (addr: string, contract: Contract) => {
    const [balance, setbalance] = React.useState('');

    React.useMemo(async () => {
        if (addr && contract && contract.balanceOf) {
            try {
                let b = parseInt(await contract.balanceOf(addr));
                setbalance(b.toString());
            } catch (error) {
                console.log(error);
            }
        } else {
            setbalance('');
        }
    }, [addr, contract]);
    return balance;
};

export {useGetBalance, useGetNFKBalance};
