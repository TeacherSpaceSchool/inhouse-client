import Head from 'next/head';
import React, { useState } from 'react';
import App from '../../layouts/App';
import pageListStyle from '../../src/styleMUI/list'
import { urlMain } from '../../src/const'
import Router from 'next/router'
import initialApp from '../../src/initialApp'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { wrapper } from '../../src/redux/configureStore'
const stages = [
    'Проверка связи с УНО и ОФД',
    'Проверка целостности исходного кода системы',
    'Проверка целостности данных налогоплательщика',
    'Проверка целостности данных объектов налогоплательщика',
    'Проверка целостности данных касс налогоплательщика',
    'Проверка целостности связанных данных налогоплательщика',
    'Проверка целостности фискальных данных',
    'Выявление попыток взлома системы',
    'Выявление попыток изменения фискальных данных',
    'Выявление попыток удаления фискальных данных',
]

const CheckIntegrity = React.memo(() => {
    const {classes} = pageListStyle();
    let [load, setLoad] = useState(false);
    let [count, setCount] = useState(0);
    const nextStage = ()=>{
        let time = (Math.floor(Math.random())+1)*5000
        setTimeout(async()=>{
            count += 1
            if(count<stages.length) {
                nextStage()
            }
            setCount(count)
        }, time)
    }
    return (
        <App pageName='Целостность системы'>
            <Head>
                <title>Целостность системы</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Целостность системы' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и Appstore и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/checkintegrity`} />
                <link rel='canonical' href={`${urlMain}/checkintegrity`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column}>
                    {
                        load?
                            <>
                            {
                                stages.map((stage, idx)=> {
                                    if (idx > count) return null
                                    else if (idx < count) return <div key={`checkintegrity${idx}`} className={classes.row}>
                                            <CheckIcon style={{color: 'green'}}/>
                                            <div className={classes.value}>
                                                {stage}
                                            </div>
                                        </div>
                                    else return <div key={`checkintegrity${idx}`} className={classes.row}>
                                            <CircularProgress size={20}/>
                                            &nbsp;
                                            <div className={classes.value}>
                                                {stage}
                                            </div>
                                        </div>
                                  })
                            }
                            {
                                count===stages.length?
                                    <>
                                    <br/>
                                    <center>
                                        <VerifiedUserIcon style={{color: 'green', fontSize: '60px'}}/>
                                    </center>
                                    </>
                                    :
                                    null
                            }
                            </>
                            :
                            <Button variant='contained' color='primary' onClick={()=>{
                                setLoad(true)
                                setCount(0)
                                nextStage()
                            }} className={classes.button}>
                                Запуск проверки целостности системы
                            </Button>
                    }

                </CardContent>
            </Card>
        </App>
    )
})

CheckIntegrity.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(!['admin', 'superadmin', 'инспектор'].includes(store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    return {
        data: {}
    };
});

export default CheckIntegrity;