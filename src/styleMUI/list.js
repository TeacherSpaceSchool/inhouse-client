import { makeStyles } from 'tss-react/mui';
export default makeStyles()(()=>{
    return {
        table: {
            minWidth: '100%',
        },
        rowTop: {
            width: '100%',
            alignItems: 'flexStart',
            display: 'flex',
            flexDirection: 'row',
        },
        tableHead: {
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            fontSize: '0.9375rem',
            color: 'black',
            flexDirection: 'row',
            borderBottom: '1px solid #00000040',
            fontWeight: 500
        },
        tableRow: {
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'black',
            borderBottom: '1px solid #00000040',
            flexDirection: 'row'
        },
        tableCell: {
            padding: 10,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'baseline',
        },
        tableCellGrid: {
            padding: 10,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'baseline',
        },
        selectClient: {
            height: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '1rem',
            color: 'black',
            fontFamily: 'Roboto',
        },
        receipt: {
            border: '1px black solid',
            width: 323,
            fontSize: 14,
            padding: 10,
            background: 'white',
            marginTop: 20
        },
        noteImageButton: {
            top: 0,
            right: 0,
            position: 'absolute',
            marginLeft: 10,
            width: 24,
            height: 24,
            cursor: 'pointer',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        noteImage: {
            width: 150,
            height: 150,
            objectFit: 'cover',
            cursor: 'pointer'
        },
        noteImageDiv: {
            width: 150,
            height: 150,
            position: 'relative'
        },
        noteImageList: {
            width: '100%',
            paddingLeft: 10,
            gap: '10px',
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            marginBottom: 5
        },
        list: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            marginTop: 10
        },
        selectType: {
            width: 100,
            textAlign: 'center',
            margin: 10,
            padding: 4,
            cursor: 'pointer',
            borderRadius: 10,
            fontSize: '1rem',
            color: 'black',
            fontFamily: 'Roboto',
            border: '1px solid black'

        },

        pageCenter: {
            margin: 10,
            width: 'calc(100% - 20px)!important',
            height: 'calc(100% - 20px)!important',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },
        status: {
            padding: 4,
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Roboto',
            top: 0,
            right: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            position: 'absolute'
        },
        message: {
            flexDirection: 'column',
            color: 'black',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            background: 'white'
        },
        logo: {
            objectFit: 'cover',
            width: 200
        },
        page: {
            margin: 10,
            width: 'calc(100% - 20px)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        geo: {
            width: 190,
            textAlign: 'center',
            marginBottom: 10,
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            borderBottom: '1px dashed #183B37',
            userSelect: 'none'
        },
        fab: {
            position: 'fixed!important',
            bottom: '20px',
            right: '20px'
        },
        fab2: {
            position: 'fixed!important',
            bottom: '20px',
            right: '90px'
        },
        fab3: {
            position: 'fixed!important',
            bottom: '20px',
            right: '160px'
        },
        fab4: {
            position: 'fixed!important',
            bottom: '20px',
            right: '230px'
        },
        fabZ: {
            position: 'fixed!important',
            zIndex: 15000,
            bottom: 2,
            right: 16
        },
        row:{
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        },
        rowCenter:{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        },
        column:{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        inputSwitch: {
            fontSize: '0.9375rem',
            margin: 10,
            width: 100
        },
        input: {
            fontSize: '0.875rem',
            margin: '10px !important',
            width: 'calc(100% - 20px)',
        },
        inputNoMargin: {
            fontSize: '0.875rem',
            margin: '0px !important',
            width: '100%',
        },
        inputHalf: {
            fontSize: '0.875rem',
            margin: '10px !important',
            width: 'calc(50% - 20px)'
        },
        inputThird: {
            fontSize: '0.875rem',
            margin: 10,
            width: 'calc((100% / 3) - 20px)'
        },
        value: {
            marginLeft: 5,
            marginBottom: 10,
            fontWeight: '500',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
        },
        nameField: {
            marginLeft: 10,
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
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
            height: 60,
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
        statisticButton: {
            width: 400,
            cursor: 'pointer',
            margin: 10,
            padding: 10
        },

        nameBasket: {
            width: 'calc(100% - 34px)',
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        closeNameBasket: {
            margin: 5,
            fontWeight: 'bold',
            color: 'red',
            cursor: 'pointer'
        },
        columnBasket: {
            margin: 5,
            display: 'flex',
            flexDirection: 'column',
        },
        nameFieldBasket: {
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
        },
        valueFieldBasket: {
            display: 'flex',
            alignItems: 'center',
            height: 22,
            fontWeight: '500',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            wordBreak: 'break-all'
        },
        counternmbrBasket: {
            width: 60,
            height: 20,
            outline: 'none',
            border: 'none',
            fontSize: '0.9375rem',
            textAlign: 'center',
        },
        counterBasket: {
            borderRadius: 5,
            overflow: 'hidden',
            border: '1px solid #e6e6e6',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        },
        counterbtnBasket: {
            userSelect: 'none',
            cursor: 'pointer',
            width: 30,
            height: 20,
            fontSize: '1rem',
            fontWeight: 700,
            background: '#e6e6e6',
            color: '#212121',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        showBasket: {
            textAlign: 'center',
            fontSize: '0.9375rem',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            userSelect: 'none',
            width: '100%'
        },
        typeShowBasket: {
            marginLeft: 10,
            fontSize: '0.9375rem',
            fontWeight: 'bold',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            userSelect: 'none',
            width: 'calc(100% - 132px)',
            maxWidth: 40
        },
        scrollDown: {
            cursor: 'pointer',
            padding: 10,
            borderRadius: 5,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            position: 'fixed',
            right: 10,
            zIndex: 1500,
            bottom: 10,
            fontSize: '0.8125rem',
            fontWeight: 'bold',
            color: 'white',
            background: '#183B37'
        },
    }
})