import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import Footer from "./Footer";
import Header from "./Header";

  const useStyles = makeStyles((theme) => ({
    container: {
      [theme.breakpoints.between('sm','lg')]: {
        marginTop: '10px',
        marginBottom: '60px',
        marginLeft: '10px',
        marginRight: '10px'
      },
      [theme.breakpoints.up('lg')]: {
        marginTop: '30px',
        marginBottom: '40px',
        marginLeft: '40px',
        marginRight: '40px'
      }
    }
  }));
const Layout = ( { children } ) => {
  const classes = useStyles();

  return (
    <>
      <Header />
      <div className={`${classes.container}`}>
        { children }
      </div>
      <Footer />
    </>
  );
};

export default Layout;