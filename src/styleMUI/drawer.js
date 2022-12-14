import { makeStyles } from 'tss-react/mui';
export default makeStyles()((theme)=>{
    return {
        drawer: {
            width: 300,
            flexShrink: 0,
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        drawerPaper: {
            width: 300,
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        toolbar: theme.mixins.toolbar,
    }
})