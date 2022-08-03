import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import cardTableStyle from '../../src/styleMUI/card'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { connect } from 'react-redux'

const TableShow =  React.memo(
    (props) =>{
        const router = useRouter();
        const classes = cardTableStyle();
        const { search, isMobileApp } = props.app;
        const { columns, rows } = props;
        return (
            <TableContainer component={Paper} className={isMobileApp?classes.tableM:classes.tableD}>
                <Table size='small'>
                    <TableHead>
                        <TableRow className={classes.tableRow}>
                            <TableCell>№</TableCell>
                            {columns.map((column, idx) => <TableCell key={`column${idx}`}>{column}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, idx) =>
                            row.href?
                                <Link href={row.href?row.href:'#'} as={row.href?row.as:'#'} key={`row${idx}`}>
                                    <TableRow className={classes.tableRow} onClick={()=>{
                                        if(row.href&&!search) {
                                            let appBody = (document.getElementsByClassName('App-body'))[0]
                                            sessionStorage.scrollPositionStore = appBody.scrollTop
                                            sessionStorage.scrollPositionName = router.asPath
                                            sessionStorage.scrollPositionLimit = rows.length
                                        }
                                    }}>
                                        <TableCell>
                                            {idx+1}
                                        </TableCell>
                                        {row.values.map((value, idx1) => <TableCell key={`cell${idx}${idx}${idx1}${idx1}`}>{value}</TableCell>)}
                                    </TableRow>
                                </Link>
                                :
                                <TableRow className={classes.tableRow} key={`row${idx}`}>
                                    <TableCell>
                                        {idx+1}
                                    </TableCell>
                                    {row.values.map((value, idx1) => <TableCell key={`cell${idx}${idx1}${idx1}${idx1}`}>{value}</TableCell>)}
                                </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(TableShow);