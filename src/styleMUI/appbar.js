import { makeStyles } from 'tss-react/mui';
export default makeStyles()(()=>{
    return {
        appBar: {
            zIndex: 1200,
        },
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
            height: 28,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1.125rem!important',
            cursor: 'pointer'
        },
        searchD: {
            position: 'fixed',
            top: 6,
            right: 6
        },
        searchM: {
            position: 'fixed',
            top: 0,
            right: 0,
            height: '56px',
            width: '100vw'
        },
        textField: {
            width: 'calc(100% - 20px)',
            margin: 10,
        },
        searchField: {
            width: 'calc(100% - 20px)',
            margin: 10,
        },
    }
})