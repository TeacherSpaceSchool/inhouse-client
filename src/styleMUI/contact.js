import { makeStyles } from 'tss-react/mui';
export default makeStyles()(()=>{
    return {
        page: {
            position: 'relative',
            margin: 10
        },
        status: {
            padding: 4,
            borderRadius: 10,
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            top: 10,
            right: 10,
            position: 'absolute',
            color: '#10183D',
            cursor: 'pointer'
        },
        geo: {
            color: '#10183D',
            width: 190,
            textAlign: 'center',
            marginBottom: 10,
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            borderBottom: '1px dashed #10183D',
            userSelect: 'none'
        },
        bottomDivD: {
            width: 'calc(100vw - 300px)',
            borderTop: '1px #aeaeae solid',
            background: '#fff',
            height: 60,
            position: 'fixed',
            bottom: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 16,
            paddingRight: 16,
            zIndex: 10000
        },
        bottomDivM: {
            width: '100vw',
            borderTop: '1px #aeaeae solid',
            background: '#fff',
            height: 50,
            position: 'fixed',
            bottom: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 10,
            paddingRight: 10,
            zIndex: 10000
        },
        row:{
            display: 'flex',
            flexDirection: 'row',
        },
        column:{
            display: 'flex',
            flexDirection: 'column',
        },
        mediaM: {
            objectFit: 'cover',
            height: 'calc(100vw - 72px)',
            width: 'calc(100vw - 72px)',
            marginBottom: 10,
        },
        mediaD: {
            objectFit: 'cover',
            height: 300,
            width: 300,
            marginRight: 10,
            marginBottom: 10,
            cursor: 'pointer'
        },
        name: {
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '1.25rem',
            fontFamily: 'Roboto'
        },
        value: {
            marginBottom: 10,
            fontWeight: '500',
            fontSize: '1rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        nameField: {
            width: 80,
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '1rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
        },
        info: {
            color: '#455A64',
            marginBottom: 10,
            fontSize: '1rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap'
        },
        input: {
            marginBottom: '10px !important',
            width: '100%',
        },
        mediaSocial: {
            objectFit: 'cover',
            height: 32,
            width: 32,
            margin: 10,
        },
    }
})