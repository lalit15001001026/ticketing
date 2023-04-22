import 'bootstrap/dist/css/bootstrap.css';
import { Component } from 'react';
import buildClient from '../api/build-client';
import  Header  from "../components/header";

const AppComponent=  ({Component, pageProps , currentUser}) =>{

    return (
    <div>
        <Header currentUser={currentUser}/>
        <Component {...pageProps} />
    </div>)
};

AppComponent.getInitialProps = async (appContext) =>{

    const { data } = await buildClient(appContext.ctx).get('/api/users/currentuser');
    let pageProps = {}
    if(appContext.Component.getInitialProps)
    {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }    
    return {
        pageProps,
        ...data
    };
    // const response = await axios.get('/api/users/currentuser;');

    // return response.data;
   
};

export default AppComponent;