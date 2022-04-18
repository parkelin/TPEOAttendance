import './style.css'
import React from 'react'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useHistory } from "react-router-dom";

export default function Layout(props) {
    const history = useHistory()
    // // gets header-height css variable
    // console.log(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))
    function getHeader() {
        if (props.noHeader) {
            return null
        }
        else if (props.customHeader) {
            return props.customHeader
        }
        else {
            return (
                <div className={props.headerFixed ? 'header fixed' : 'header'}>
                    <div className='header-left'>
                        <IconButton size='large' className='back-button' onClick={() => history.push("/admin")}>
                            <ArrowBack />
                        </IconButton>
                        {props.headerTitle && <h2 className="header-title">{props.headerTitle}</h2>}
                    </div>
                    <div className='header-grow'>
                    </div>
                    <div className='header-right'>
                        {props.headerRight}
                    </div>
                </div>
            )
        }
    }

    return (
        <div
            className="layout"
        >
            {
                getHeader()
            }
            <div className={props.headerFixed ? 'content header-fixed' : 'content'}>
                {props.children}
            </div>
            <div className='background'>
                {
                    props.background
                    /* <div className='test'></div> */
                }
            </div>
        </div>
    )
}