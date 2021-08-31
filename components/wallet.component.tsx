import {useGetBalance} from '../hooks/Balance';
import {minimizeAddress} from '../util/address';
import {getNetworkName} from '../util/network';

import MetamaskIcon from '../assets/images/metamask.png';
import {GitcoinContext} from '../store';
import React from 'react';
import Image from 'next/image';
import Web3 from 'web3';
declare const window: any;
const WalletComponent = () => {
    const {state, dispatch} = React.useContext(GitcoinContext);
    const wallets = state.wallets;
    const balance = useGetBalance(wallets[state.wallet], state.provider);
    const onMetamaskConnect = async () => {
        //@ts-ignore
        const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
    };
    const handleAccountsChanged = (accounts: string[]) => {
        dispatch({
            type: 'SET_WALLETS',
            payload: accounts,
        });
        let myweb3: any = new Web3(window.ethereum);

        dispatch({
            type: 'SET_PROVIDER',
            payload: myweb3.currentProvider,
        });
    };

    const handleChainChanged = (chainId: number) => {
        dispatch({
            type: 'SET_CHAIN_ID',
            //@ts-ignore
            payload: parseInt(chainId, 16).toString(),
        });
    };
    const _stup = async () => {
        if (!window.ethereum) {
            return;
        }
        let myweb3: any = new Web3(window.ethereum);
        const accounts = window.ethereum
            .request({
                method: 'eth_accounts',
            })
            .then(handleAccountsChanged)
            .catch((err: any) => console.error(err));
        //@ts-ignore
        window.ethereum.on('accountsChanged', handleAccountsChanged);

        window.ethereum.on('chainChanged', handleChainChanged);

        // let myweb3: any = new Web3(window.ethereum);

        dispatch({
            type: 'SET_CHAIN_ID',
            payload: (await myweb3.eth.net.getId()).toString(),
        });
    };

    React.useEffect(() => {
        let myweb3: any = new Web3(window.ethereum);
        dispatch({
            type: 'SET_PROVIDER',
            payload: myweb3.currentProvider,
        });
        _stup();

        return () => {
            if (window.ethereum.removeListener) {
                window.ethereum.removeListener(
                    'accountsChanged',
                    handleAccountsChanged
                );
                window.ethereum.removeListener(
                    'chainChanged',
                    handleChainChanged
                );
            }
        };
    }, []);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#232731',
                }}
            >
                {state.wallets[state.wallet] ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100',
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                border: '2px solid white',
                                padding: 8,
                                textShadow: '1px 2px 3px black',
                            }}
                        >
                            {balance + ' ETH'}
                        </p>
                    </div>
                ) : null}

                <div
                    style={{
                        margin: 0,
                        border: '2px solid white',
                        padding: 8,
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        textShadow: '1px 2px 3px black',
                    }}
                    onClick={onMetamaskConnect}
                >
                    {state.wallets[state.wallet] ? (
                        minimizeAddress(state.wallets[state.wallet])
                    ) : (
                        <div
                            onClick={onMetamaskConnect}
                            className={'btn-icon'}
                            style={{margin: '0 0.5rem'}}
                        >
                            <Image
                                alt="wallet"
                                src={MetamaskIcon}
                                height="32"
                                width="32"
                            />

                            <div
                                style={{
                                    fontSize: '1rem',
                                    color: 'red',
                                    fontFamily: 'Roboto',
                                }}
                            >
                                {getNetworkName(state.chain_id)}
                            </div>
                        </div>
                    )}
                    <div
                        style={{
                            textAlign: 'center',
                            fontSize: '1rem',
                            color: 'red',
                            fontFamily: 'Roboto',
                        }}
                    >
                        {getNetworkName(state.chain_id)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletComponent;
