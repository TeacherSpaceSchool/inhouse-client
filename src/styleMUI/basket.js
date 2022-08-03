import { makeStyles } from 'tss-react/mui';
export default makeStyles()(()=>{
    return {
        list: {
            overflow: 'auto',
            height: 'calc(100vh - 190px)'
        },
        selectClient: {
            height: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '1.0625rem',
            color: 'black',
            fontFamily: 'Roboto'
        },
        media: {
            width: '100px!important',
            height: '100px!important',
            objectFit: 'contain',
            marginRight: 10
        },
        name: {
            marginBottom: 5,
            fontSize: '1rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        allPrice: {
            fontWeight: 'bold',
            fontSize: '1.0625rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        discount: {
            marginBottom: 5,
            fontSize: '1rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all',
            color: '#f00',
            fontWeight: 'bold',
        },
        price: {
            fontWeight: 'bold',
            marginBottom: 5,
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        priceBeforeDiscount: {
            fontWeight: 'bold',
            marginBottom: 5,
            fontSize: '0.875rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all',
            color: '#888'
        },
        counter: {
            width: 160,
            height: 30,
            borderRadius: 5,
            overflow: 'hidden',
            border: '1px solid #e6e6e6',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        counterbtn: {
            userSelect: 'none',
            cursor: 'pointer',
            width: 40,
            height: 30,
            fontSize: '1rem',
            fontWeight: 700,
            background: '#e6e6e6',
            color: '#212121',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        counternmbr: {
            width: 80,
            height: 30,
            outline: 'none',
            border: 'none',
            fontSize: '1rem',
            textAlign: 'center',
        },
        info: {
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            color: '#183B37',
            userSelect: 'none'
        },
        addCharacteristic: {
            width: 180,
            marginTop: 5,
            marginBottom: 15,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            borderBottom: '1px dashed #183B37',
            color: '#183B37',
            userSelect: 'none'
        },
        characteristic: {
            marginBottom: 5,
            textAlign: 'center',
            fontSize: '0.875rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            userSelect: 'none'
        },
        buy: {
            right: 5,
            position: 'absolute'
        },
        buyDiv: {
            position: 'relative',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            maxWidth: 600
        },
    }
})