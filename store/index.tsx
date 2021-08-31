import {ethers} from 'ethers';
import * as React from 'react';
import {Tracing} from 'trace_events';
declare const window: any;
type Action = {type: string; payload?: any};
type Dispatch = (action: Action) => void;

type State = {
    chain_id: string;

    profile: {name: string; user_id: string; address: string};
    token: string;

    wallet: number;
    provider: any;
    wallets: string[];
};
type GitcoinProviderProps = {children: React.ReactNode};

const initialState: State = {
    chain_id: '42',
    profile: {name: '', user_id: '', address: ''},
    token: '',
    wallet: 0,
    wallets: [],
    provider: null,
};

const GitcoinContext = React.createContext<{state: State; dispatch: Dispatch}>(
    initialState as any
);

const gitcoinReducer = (state: State, action: Action): State => {
    // console.log(action);

    switch (action.type) {
        case 'SET_ACTIVE_WALLET': {
            return {
                ...state,
                wallet: action.payload,
            };
        }

        case 'SET_WALLETS': {
            return {
                ...state,
                wallets: [...action.payload],
            };
        }

        case 'SETUP': {
            return {
                ...state,
                token: action.payload.token,
                profile: action.payload.profile,
            };
        }
        case 'SET_TOKEN': {
            return {
                ...state,
                token: action.payload,
            };
        }
        case 'SET_PROFILE': {
            return {...state, profile: action.payload};
        }
        case 'SET_CHAIN_ID': {
            return {
                ...state,
                chain_id: action.payload,
                provider: new ethers.providers.Web3Provider(
                    window.ethereum,
                    _getNetworkName(action.payload).toLocaleLowerCase()
                ),
            };
        }
        case 'SET_PROVIDER': {
            return {
                ...state,
                provider: action.payload,
            };
        }

        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const GitcoinProvider = ({children}: GitcoinProviderProps) => {
    const [state, dispatch] = React.useReducer(gitcoinReducer, initialState);

    return (
        <GitcoinContext.Provider value={{state, dispatch}}>
            {children}
        </GitcoinContext.Provider>
    );
};
export {GitcoinContext, GitcoinProvider};

const _getNetworkName = (id: string) => {
    switch (id) {
        case '1':
            return 'Mainnet';
        case '5':
            return 'Goerli';
        case '3':
            return 'Ropsten';
        case '4':
            return 'Rinkeby';
        case '42':
            return 'Kovan';
        default:
            return 'Kovan'; //TODO
    }
};
