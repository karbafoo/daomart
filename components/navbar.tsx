import type {NextPage} from 'next';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import HeartIcon from '../assets/images/heart.png';
import Image from 'next/image';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderTop: `1px solid ${theme.palette.primary.dark}`,
            borderBottom: `1px solid ${theme.palette.primary.dark}`,
        },
        link: {
            padding: '0 1.5rem',
            borderRight: `1px solid ${theme.palette.primary.dark}`,
            borderLeft: `1px solid ${theme.palette.primary.dark}`,
            cursor: 'pointer',
            '&:hover': {
                position: 'relative',
                top: '1px',
            },
            fontFamily: 'DeterminationMonoWebRegular',
            fontSize: '1.5rem',
            display: 'flex',
        },
        navbar: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
    })
);
const Navbar: NextPage = ({children}) => {
    const styles = useStyles();
    return (
        <AppBar position="static" className={styles.container}>
            <Toolbar variant="dense" className={styles.navbar}>
                <Link href="/shop">
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        className={styles.link}
                    >
                        STORE
                    </Typography>
                </Link>
                <Link href="/">
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        className={styles.link}
                    >
                        ARCHIVE
                    </Typography>
                </Link>
                <Link href="/">
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        className={styles.link}
                    >
                        COLLECTION
                    </Typography>
                </Link>
                <Link href="/about">
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        className={styles.link}
                    >
                        ABOUT
                    </Typography>
                </Link>
                <Link href="/claim">
                    <Typography
                        variant="h6"
                        color="textPrimary"
                        className={styles.link}
                    >
                        <Image
                            src={HeartIcon}
                            height="24"
                            width="24"
                            objectFit={'contain'}
                            alt="DAOMART CLAIM REWARD"
                        />
                        CLAIM!
                    </Typography>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
