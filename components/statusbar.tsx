import type {NextPage} from 'next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Image from 'next/image';
import MoonshotBotIcon from '../assets/images/bot00.png';
import WalletComponent from './wallet.component';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        bigtitle: {
            fontWeight: 'bold',
            fontFamily: 'Bazar',
        },
    })
);
const Statusbar: NextPage = ({children}) => {
    const styles = useStyles();
    return (
        <AppBar position="static" className={styles.container}>
            <Toolbar
                variant="dense"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flex: 1,
                    marginLeft: '10rem',
                }}
            >
                <a href="/">
                    <Image
                        src={MoonshotBotIcon}
                        alt="Daomart logo"
                        width={100}
                        height={100}
                    />
                </a>
                <a href="/">
                    <Typography
                        variant="h1"
                        color="textPrimary"
                        className={styles.bigtitle}
                    >
                        DAOMART
                    </Typography>
                </a>
            </Toolbar>
            <Container
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '15rem',
                }}
            >
                <WalletComponent />
            </Container>
        </AppBar>
    );
};

export default Statusbar;
