import type {NextPage} from 'next';
import Layout from '../../components/layout';
import {useRouter} from 'next/router';

import {Button, Container, Paper} from '@material-ui/core';
import React from 'react';
import {useEmblaCarousel} from 'embla-carousel/react';
import Image from 'next/image';
import Typography from '@material-ui/core/Typography';

import {orange} from '@material-ui/core/colors';
import Web3 from 'web3';
import {getFetcher, postReqHandler} from '../../network';
import useSWR from 'swr';
import {GitcoinContext} from '../../store';
import {formatEther, parseEther} from 'ethers/lib/utils';
const Product: NextPage = ({postData}: any) => {
    const router = useRouter();
    const {id} = router.query;
    const {data, error} = useSWR('product', getFetcher);

    const products = data && data.success && data.data;
    return (
        <Layout>
            <CarouselItem
                item={
                    products && products.length
                        ? products.find((p) => p.product_id === id)
                        : null
                }
            />
        </Layout>
    );
};
declare const window: any;
export default Product;

const DEFAUL_PHOTO =
    'https://cdn.shopify.com/s/files/1/0258/8924/3182/products/CheetahhoodieFront_1800x1800.png?v=1628875358';

const CarouselItem = ({item}) => {
    const {state, dispatch} = React.useContext(GitcoinContext);
    const [currentEthPrice, setcurrentEthPrice] = React.useState({
        loading: false,
        price: 0,
    });
    const [currentCandyPrice, setcurrentCandyPrice] = React.useState({
        loading: false,
        price: 0,
    });
    const [loading, setLoading] = React.useState(false);

    const buyWithEther = () => {
        postReqHandler('contract', {chain: state.chain_id})
            .then((data) => {
                const d = data && data.success ? data.data : {};
                console.log('d', d);
                if (d && d.moonshot) {
                    setLoading(true);

                    let myweb3: any = new Web3(window.ethereum);

                    let metadata;
                    try {
                        metadata = require('../../contracts/moonshot.json');
                    } catch (e) {
                        console.log(e);
                        setLoading(false);
                    }
                    const moonshotWeb3Contract = new myweb3.eth.Contract(
                        metadata.abi,
                        d.moonshot.address
                    );
                    console.log('moonshotWeb3Contract', moonshotWeb3Contract);

                    const index = parseInt(item.code);
                    if (index > -1) {
                        moonshotWeb3Contract.methods
                            .requestMint(index, state.wallets[state.wallet])
                            .send({
                                from: state.wallets[state.wallet],
                                value: parseEther(
                                    currentEthPrice.price.toString()
                                ),
                            })
                            .then((res) => {
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.log('err', err);
                                setLoading(false);
                            });
                    } else {
                        setLoading(false);
                        console.log(item.code);
                    }
                } else {
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };
    const buyWithCandy = () => {
        postReqHandler('contract', {chain: state.chain_id})
            .then((data) => {
                const d = data && data.success ? data.data : {};
                console.log('d', d);
                if (d && d.moonshot) {
                    setLoading(true);

                    let myweb3: any = new Web3(window.ethereum);

                    let metadata;
                    let candymetadata;
                    try {
                        metadata = require('../../contracts/moonshot.json');
                        candymetadata = require('../../contracts/candy.json');
                    } catch (e) {
                        console.log(e);
                        setLoading(false);
                    }
                    const moonshotWeb3Contract = new myweb3.eth.Contract(
                        metadata.abi,
                        d.moonshot.address
                    );
                    const candyWeb3Contract = new myweb3.eth.Contract(
                        candymetadata.abi,
                        d.candy.address
                    );

                    const index = parseInt(item.code);
                    if (index > -1) {
                        candyWeb3Contract.methods
                            .approve(
                                moonshotWeb3Contract._address,
                                parseEther(currentCandyPrice.price.toString())
                            )
                            .send({
                                from: state.wallets[state.wallet],
                            })
                            .then((res) => {
                                moonshotWeb3Contract.methods
                                    .requestMintWithToken(
                                        index,
                                        state.wallets[state.wallet],
                                        parseEther(
                                            currentCandyPrice.price.toString()
                                        )
                                    )
                                    .send({
                                        from: state.wallets[state.wallet],
                                    })
                                    .then((res) => {
                                        setLoading(false);
                                    })
                                    .catch((err) => {
                                        console.log('err', err);
                                        setLoading(false);
                                    });
                            })
                            .catch((err) => {
                                console.log('err', err);
                                setLoading(false);
                            });
                    } else {
                        setLoading(false);
                        console.log(item.code);
                    }
                } else {
                    setLoading(false);
                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    React.useEffect(() => {
        if (!item) {
            return;
        }
        postReqHandler('contract', {chain: state.chain_id})
            .then((data) => {
                const d = data && data.success ? data.data : {};
                console.log('d', d);
                if (d && d.moonshot) {
                    setcurrentCandyPrice({...currentEthPrice, loading: true});
                    setcurrentEthPrice({...currentCandyPrice, loading: true});
                    let myweb3: any = new Web3(window.ethereum);

                    let metadata;
                    try {
                        metadata = require('../../contracts/moonshot.json');
                    } catch (e) {
                        console.log(e);
                        setcurrentCandyPrice({
                            ...currentEthPrice,
                            loading: false,
                        });
                        setcurrentEthPrice({
                            ...currentCandyPrice,
                            loading: false,
                        });
                    }
                    const moonshotWeb3Contract = new myweb3.eth.Contract(
                        metadata.abi,
                        d.moonshot.address
                    );
                    console.log('moonshotWeb3Contract', moonshotWeb3Contract);

                    const index = parseInt(item.code);
                    if (index > -1) {
                        Promise.all([
                            moonshotWeb3Contract.methods
                                .getCurrentEthPrice(index)
                                .call(),
                            moonshotWeb3Contract.methods
                                .getCurrentERC20Price(index)
                                .call(),
                        ])
                            .then(([ethPrice, candyPrice]) => {
                                setcurrentCandyPrice({
                                    ...currentEthPrice,
                                    price: parseFloat(formatEther(candyPrice)),
                                    loading: false,
                                });
                                setcurrentEthPrice({
                                    ...currentCandyPrice,
                                    price: parseFloat(formatEther(ethPrice)),
                                    loading: false,
                                });
                            })
                            .catch((err) => {
                                console.log('err', err);
                                setcurrentCandyPrice({
                                    ...currentEthPrice,
                                    price: 0,
                                    loading: false,
                                });
                                setcurrentEthPrice({
                                    ...currentCandyPrice,
                                    price: 0,
                                    loading: false,
                                });
                                // alert('Error');
                            });
                    } else {
                        setcurrentCandyPrice({
                            ...currentEthPrice,
                            price: 0,
                            loading: false,
                        });
                        setcurrentEthPrice({
                            ...currentCandyPrice,
                            price: 0,
                            loading: false,
                        });

                        console.log(item.code);
                    }
                }
            })
            .catch((err) => {
                setcurrentCandyPrice({...currentEthPrice, loading: false});
                setcurrentEthPrice({...currentCandyPrice, loading: false});
                console.log(err);
            });
    }, [item, loading]);
    if (!item) {
        return null;
    }
    return (
        <div className="embla__slide" style={{}}>
            <Container
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    margin: '2rem 0',
                    height: '30rem',
                }}
            >
                <Container
                    style={{
                        width: '20rem',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        height: '30rem',
                    }}
                >
                    <div
                        className="frame"
                        style={{
                            width: '100%',
                            position: 'relative',
                            height: '100%',
                        }}
                    >
                        {' '}
                        <div
                            className="frame-inner"
                            style={{
                                width: '100%',
                                position: 'relative',
                                height: '100%',
                            }}
                        >
                            <Image
                                src={item.avatar || DEFAUL_PHOTO}
                                objectFit={'contain'}
                                alt="DAOMART CLAIM REWARD"
                                layout="fill"
                                className="picture-frame"
                            />
                        </div>
                    </div>
                </Container>
                <Container
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '30rem',
                    }}
                >
                    <Container
                        style={{
                            width: '100%',
                            padding: 0,
                        }}
                    >
                        <Typography
                            style={{
                                fontFamily: 'AmericanCaptain',
                                color: orange[300],
                                fontSize: '2rem',
                                textShadow: '1px 1px 3px black',
                                margin: 4,
                            }}
                        >
                            {`${item.category} (${item.type})`}
                        </Typography>

                        <Typography
                            variant={'h3'}
                            style={{
                                fontFamily: 'Franchise',
                                fontSize: '5rem',
                                textShadow: '1px 1px 3px black',
                            }}
                        >
                            {item.name}
                        </Typography>
                    </Container>
                    <Typography
                        style={{
                            fontFamily: 'MarketDeco',
                        }}
                    >
                        {item.description || item.description.length < 10
                            ? FAKE_DESC
                            : item.description}
                    </Typography>
                    <Container
                        style={{
                            width: '100%',
                            padding: 0,
                            margin: '1rem 0',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            style={{
                                alignSelf: 'flex-end',
                                width: '10rem',
                                border: '2px solid rgba(40,40,40,.75)',
                                color: 'rgba(40,40,40,1)',
                                borderRadius: 0,
                                fontWeight: 'bolder',
                                fontFamily: 'Bazar',
                                fontSize: '1.2rem',
                                padding: '0',
                                margin: ' 0 1rem ',
                            }}
                        >
                            READ MORE{' '}
                        </Button>

                        <Button
                            onClick={() => buyWithEther()}
                            style={{
                                alignSelf: 'flex-end',
                                width: '10rem',
                                border: '2px solid rgba(40,40,40,.75)',
                                color: 'rgba(40,40,40,1)',
                                borderRadius: 0,
                                fontWeight: 'bolder',
                                fontFamily: 'Bazar',
                                fontSize: '1.2rem',
                                padding: '0',
                                margin: '0 1rem',
                            }}
                        >
                            {`BUY WITH ETH `}
                            <span style={{color: 'crimson'}}>
                                {currentEthPrice.loading
                                    ? ''
                                    : currentEthPrice.price}
                            </span>
                        </Button>
                        <Button
                            onClick={() => buyWithCandy()}
                            style={{
                                alignSelf: 'flex-end',
                                width: '10rem',
                                border: '2px solid rgba(40,40,40,.75)',
                                color: 'rgba(40,40,40,1)',
                                borderRadius: 0,
                                fontWeight: 'bolder',
                                fontFamily: 'Bazar',
                                fontSize: '1.2rem',
                                padding: '0',
                                margin: '0 1rem',
                            }}
                        >
                            {` BUY with CANDY `}
                            <span style={{color: 'crimson'}}>
                                {' '}
                                {currentCandyPrice.loading
                                    ? ''
                                    : currentCandyPrice.price}
                            </span>
                        </Button>
                    </Container>
                </Container>
            </Container>
        </div>
    );
};
const FAKE_DESC = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in
reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat
non proident, sunt in culpa qui officia deserunt mollit
anim id est laborum.`;
