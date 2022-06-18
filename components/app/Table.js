import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { connect } from 'react-redux'
import { userSelectNone } from '../../src/styleMUI/lib'
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import Pagination from '@mui/material/Pagination';
import { bindActionCreators } from 'redux'
import * as appActions from '../../src/redux/actions/app'

const MyTable =  React.memo(
    (props) =>{
        const { search } = props.app;
        const { setColumns } = props.appActions;
        const { columns, row, click } = props;
        const [count, setCount] = React.useState(0);
        const [page, setPage] = React.useState(1);
        let [data, setData] = useState([])
        let [sort, setSort] = useState({
            idx: null,
            orient: '+'
        })
        useEffect(()=>{

            if(!props.app.columns.length)
                setColumns(columns.map(elem=>{return {name: elem, show: true}}))

            data = row.map((row)=>{
                let data = [...row.data]
                if(click)
                    data.splice(click, 1)
                return [...data]
            })
            if(search)
                data = data.filter(data=>{
                    return data.toString().toLowerCase().includes(search.toLowerCase())
                })

            if(sort.idx!==null) {
                let nan = isNaN(parseInt(data[0][sort.idx]))
                data = data.sort(function(a, b) {
                    if(nan) {
                        if (a[sort.idx]<b[sort.idx])
                            return sort.orient==='-'?-1:1;
                        else if (a[sort.idx]>b[sort.idx])
                            return sort.orient==='-'?1:-1;
                        else
                            return 0;
                    }
                    else
                        return sort.orient==='-'?
                            parseInt(b[sort.idx]) - parseInt(a[sort.idx])
                            :
                            parseInt(a[sort.idx]) - parseInt(b[sort.idx])
                });
            }

            setCount(parseInt(data.length/100)+1)

            setData([...data])
        },[search, sort, row])
        return (
            <div style={{display: 'flex', width: '100%', gap: '10px', flexDirection: 'column', alignItems: 'center'}}>
                <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                    <Table stickyHeader sx={{ minWidth: '100%' }} aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                {columns.map((cell, idx) => {
                                    if(props.app.columns[idx]&&props.app.columns[idx].show)
                                        return <TableCell
                                            style={{cursor: 'pointer', ...userSelectNone}}
                                            onClick={() => {
                                                setSort({
                                                    idx,
                                                    orient: sort.idx !== idx ? '-' : sort.orient === '+' ? '-' : '+'
                                                })
                                            }}>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                {
                                                    idx === sort.idx ?
                                                        sort.orient === '+' ?
                                                            <ArrowUpward fontSize='small'/>
                                                            :
                                                            <ArrowDownward fontSize='small'/>
                                                        :
                                                        <ArrowUpward fontSize='small' sx={{visibility: 'hidden'}}/>
                                                }
                                                <div>{cell}</div>
                                            </div>
                                        </TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, idx) => {
                                if(idx<page*100&&(page===1||(idx+1)>(page-1)*100)) {
                                    return (
                                        <TableRow
                                        >
                                            <TableCell>
                                                {idx + 1}
                                            </TableCell>
                                            {row.map((cell, idx1) => {
                                                if(props.app.columns[idx1]&&props.app.columns[idx1].show)
                                                    return <TableCell
                                                        sx={{
                                                            textOverflow: 'ellipsis',
                                                            maxHeight: '400px',
                                                            maxWidth: '200px',
                                                            overflow: 'hidden',
                                                            wordWrap: 'break-word'
                                                        }} align='left'>{cell}</TableCell>
                                            })}
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    count>1?
                        <Pagination count={count} color='primary' variant='outlined' page={page} onChange={(event, value) => setPage(value)} />
                        :
                        null
                }
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTable);