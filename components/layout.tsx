import type {NextPage} from 'next';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Navbar from './navbar';
import Statusbar from './statusbar';
const Layout: NextPage = ({children}) => {
    return (
        <>
            <Container
                maxWidth="xl"
                className="background"
                style={{display: 'block'}}
            >
                <Box className="layout" sx={{bgcolor: '#844624'}}>
                    <Statusbar /> <Navbar /> {children}
                </Box>
            </Container>
        </>
    );
};

export default Layout;
