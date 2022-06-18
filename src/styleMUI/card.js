import { makeStyles } from 'tss-react/mui';
export default makeStyles()(()=>{
    return {
        cardM: {
            background: 'white',
            width: 'calc(100vw - 20px)',
            marginBottom: 10,
            position: 'relative',
            borderRadius: 4,
            height: 'auto !important'
        },
        shapka: {
            margin: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        title: {
            fontSize: '1rem',
            fontWeight: 'bold',
            width: 'calc(100% - 80px)'
        },
        cardD: {
            background: 'white',
            width: 400,
            margin: 5,
            borderRadius: 4,
            position: 'relative',
            height: 'auto !important'
        },
        sync: {
            position: 'absolute',
            bottom: 15,
            right: 15,
            fontSize: 23
        },
        mediaM: {
            objectFit: 'cover',
            height: 'calc((100vw - 20px) / 2)',
            width: 'calc(100vw - 20px)'
        },
        mediaD: {
            objectFit: 'cover',
            height: 200,
            width: 400,
            cursor: 'pointer'
        },
        input: {
            width: '100%',
            marginBottom: '10px !important'
        },
        halfInput: {
            width: 224,
            marginBottom: 10
        },
        icon: {
            width: '50%',
            marginBottom: 10
        },
        column: {
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            flexDirection: 'column',
        },
        row: {
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'row',
        },
        value: {
            marginBottom: 10,
            fontWeight: '500',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        nameField: {
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
        },
        number: {
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '1rem',
            fontFamily: 'Roboto',
        },
        date: {
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
        },
        listStatus: {
            position: 'absolute',
            top: 10,
            right: 10,
            height: 256,
            overflow: 'scroll',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
        },
        pinRightTop: {
            position: 'absolute',
            top: 10,
            right: 10,
        },
        status: {
            padding: 4,
            borderRadius: 10,
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Roboto',
            top: 10,
            right: 10,
            position: 'absolute',
        },
    }
})