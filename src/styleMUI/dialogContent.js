import { makeStyles } from 'tss-react/mui';
export default makeStyles()((theme)=>{
    return {
        main:{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        },
        inputHalf: {
            fontSize: '0.875rem',
            margin: '10px !important',
            width: 'calc(50% - 20px)'
        },
        fullDialogBody:{
            height: 'calc(100vh - 155px)',
            width: '100%',
            overflow: 'auto',
            marginBottom: 10
        },
        miniDialogBody:{
            width: '100%',
            marginBottom: 10
        },
        noteImageDiv: {
            position: 'relative'
        },
        noteImage: {
            marginLeft: 10,
            width: 80,
            height: 80,
            cursor: 'pointer'
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
        noteImageList: {
            display: 'flex',
            overflowX: 'auto'
        },
        addPackaging: {
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
            fontSize: '0.8125rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            borderBottom: '1px dashed #183B37',
            userSelect: 'none',
        },
        input: {
            marginBottom: '10px !important',
            width: '100%',
        },
        mainLine:{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        },
        button: {
            margin: theme.spacing(1),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        message: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            textAlign: 'center',
            color: 'indigo',
            fontWeight: 'bold',
            cursor: 'pointer',
            overflowWrap: 'break-word',
            fontSize: '1rem'
        },
        itogo: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            textAlign: 'left',
            fontSize: '1rem',
        },
        error_message: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            color: 'red',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center'
        },
        nameField: {
            marginBottom: 10,
            fontWeight: 'bold',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            color: '#A0A0A0'
        },
        value: {
            marginBottom: 10,
            fontWeight: '500',
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
        },
        row: {
            width: '100%',
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'row',
        },
        column: {
            width: '100%',
            alignItems: 'baseline',
            display: 'flex',
            flexDirection: 'column',
        },
        fabGeo: {
            position: 'fixed',
            bottom: 70,
            right: 35
        },
        geo: {
            width: 190,
            textAlign: 'center',
            marginTop: -5,
            marginBottom: 10,
            fontSize: '0.9375rem',
            fontFamily: 'Roboto',
            whiteSpace: 'pre-wrap',
            cursor: 'pointer',
            userSelect: 'none',
            borderBottom: '1px dashed #183B37'
        },
        minibtn: {
            marginRight: 20,
            marginBottom: 10,
            userSelect: 'none',
            cursor: 'pointer',
            width: 50,
            height: 20,
            fontSize: '0.9375rem',
            fontWeight: 700,
            background: '#e6e6e6',
            color: '#212121',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        chip: {
            margin: theme.spacing(0.5),
            cursor: 'pointer',
        },
        counternmbr: {
            width: 80,
            height: 20,
            outline: 'none',
            border: 'none',
            fontSize: '0.9375rem',
            textAlign: 'center',
        },
        counter: {
            marginBottom: 15,
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
        typeShow: {
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
    }
})