import type {NextPage} from 'next';
import Head from 'next/head';
import Layout from '../../components/layout';
import Container from '@material-ui/core/Container';
import Image from 'next/image';
import MalwareIcon from '../../assets/images/blushing_malware.png';
import HeartIcon from '../../assets/images/heart.png';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Web3 from 'web3';
import useSWR from 'swr';
import {postReqHandler} from '../../network';
import React from 'react';
import {GitcoinContext} from '../../store';
import {BigNumber} from 'ethers';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
declare const window: any;
function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Claim: NextPage = () => {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const {state, dispatch} = React.useContext(GitcoinContext);
    const onClaim = async () => {
        postReqHandler('contract', {chain: state.chain_id})
            .then((data) => {
                const d = data && data.success ? data.data : {};

                if (d && d.candy) {
                    setLoading(true);
                    let myweb3: any = new Web3(window.ethereum);

                    let metadata;
                    try {
                        metadata = require('../../contracts/candy.json');
                    } catch (e) {
                        console.log(e);
                        setLoading(false);
                    }
                    const candyWeb3Contract = new myweb3.eth.Contract(
                        metadata.abi,
                        d.candy.address
                    );
                    console.log('candyWeb3Contract', candyWeb3Contract);

                    candyWeb3Contract.methods
                        .getCandy(
                            state.wallets[state.wallet],
                            BigNumber.from(10).pow(18).mul(69)
                        )
                        .send({
                            from: state.wallets[state.wallet],
                        })
                        .then((res) => {
                            setLoading(false);
                            setSnackbarOpen(true);
                        })
                        .catch((err) => {
                            setLoading(false);
                        });
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };
    return (
        <Layout>
            <Head>
                <title>DAOMART - ClaiM Rewards</title>
            </Head>
            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: '7%',
                }}
            >
                <Image
                    src={MalwareIcon}
                    objectFit={'contain'}
                    height="256"
                    width="256"
                    alt="DAOMART CLAIM REWARD"
                />
                <Container style={{flex: 0, padding: 32, margin: 0}}>
                    <Typography
                        className="custom-font DeterminationMWR"
                        variant={'h3'}
                    >
                        Congratulations
                    </Typography>
                    <Typography
                        className="custom-font DeterminationMWR"
                        variant="h6"
                        align="center"
                    >
                        {`YOU ARE ELLIGABLE TO CLAIM`}
                        <p style={{margin: 0}}>
                            <span
                                style={{
                                    color: 'crimson',
                                    fontWeight: 'bold',
                                    padding: '0 0.5rem',
                                    fontSize: '1.5rem',
                                }}
                            >
                                {`Ξ${69}`}
                            </span>
                            {`Reward tokens`}
                        </p>
                    </Typography>
                    <Container
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: 32,
                        }}
                    >
                        <Button
                            style={{
                                width: '10rem',
                                border: '2px solid rgba(40,40,40,.75)',
                                color: 'rgba(40,40,40,1)',
                                borderRadius: 0,
                                fontWeight: 'bolder',
                                fontFamily: 'DeterminationMonoWebRegular',
                                fontSize: '2rem',
                            }}
                            onClick={() => onClaim()}
                            disabled={loading}
                        >
                            <Image
                                src={HeartIcon}
                                height="24"
                                width="24"
                                objectFit={'contain'}
                                alt="DAOMART CLAIM REWARD"
                            />
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'CLAIM!'
                            )}
                        </Button>
                    </Container>
                </Container>
                <Image
                    src={MalwareIcon}
                    objectFit={'contain'}
                    height="256"
                    width="256"
                    alt="DAOMART CLAIM REWARD"
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="success"
                    >
                        successfully claimed 69 RWD tokens!
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
};

export default Claim;
