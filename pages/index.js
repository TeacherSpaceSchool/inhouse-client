import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import {getWorkShifts, startWorkShift} from '../src/gql/workShift'
import { urlMain } from '../src/const'
import initialApp from '../src/initialApp'
import CardWorkshift from '../components/CardWorkshift'
import LazyLoad from 'react-lazyload';
import CardWorkshiftPlaceholder from '../components/CardPlaceholder'
import Link from 'next/link';
import Button from '@mui/material/Button';
import SetCashbox from '../components/dialog/SetCashbox'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../src/redux/actions/mini_dialog'
import * as appActions from '../src/redux/actions/app'
import * as snackbarActions from '../src/redux/actions/snackbar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { getClientGqlSsr } from '../src/apollo'
import TextField from '@mui/material/TextField';
import PointofsaleIcon from '../icons/pointofsale.svg';
import { inputFloat, checkFloat } from '../src/lib'
import IconButton from '@mui/material/IconButton';
import { ndsTypes, nspTypes } from '../src/const'
import {getLegalObject} from '../src/gql/legalObject'
import Buy from '../components/dialog/Buy'
import { wrapper } from '../src/redux/configureStore'
const height = 400

const Index = React.memo((props) => {
    const {classes} = pageListStyle();
    const { profile } = props.user;
    const { isMobileApp, cashbox, legalObject } = props.app;
    const { data } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showLoad } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    let [allAmount, setAllAmount] = useState(0);
    let [expired, setExpired] = useState(false);
    let [list, setList] = useState(data.list?data.list:[]);
    useEffect(()=>{
        if(list.length&&'кассир'===profile.role){
            expired = ((new Date()-list[0].start)/1000/60/60)>24
            if(expired)
                showSnackBar('Cмена просрочена', 'error')
            setExpired(expired)
        }
    }, []);
    useEffect(() => {
        import('react-facebook-pixel')
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init('1054641005122488', null, {
                    autoConfig: true,
                    debug: false
                })
                ReactPixel.pageView()
            })
    }, [])

    return (
        <App pageName='Главная'>
            <Head>
                <title>Главная</title>
                <meta name='description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:title' content='Главная' />
                <meta property='og:description' content='SALYK.STORE(Онлайн ККМ) - это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarke и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/512x512.png`} />
                <meta property='og:url' content={`${urlMain}`} />
                <link rel='canonical' href={`${urlMain}`}/>
            </Head>
            <div className={['кассир', 'admin', 'superadmin', 'оператор'].includes(profile.role)?classes.pageCenter:classes.page}>
                {
                    !profile.role?
                        <div style={{background: 'white', padding: 10, overflow: 'hidden'}}>
                            {
                                isMobileApp?
                                    <Link href='/connectionapplications'>
                                        <div className={classes.scrollDown}>
                                            ЗАЯВКА НА ПОДКЛЮЧЕНИЕ
                                        </div>
                                    </Link>
                                    :
                                    null
                            }
                            <div style={{display: 'none'}}>
                                ККМ КАССА БИШКЕК КЫРГЫЗСТАН НАЛОГИ MegaKassa ККМ онлайн О!Касса контрольно кассовая машина оператор фискальных данных ОФД
                            </div>
                            <p><strong><img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={`${urlMain}/512x512.png`} width={273} height={273} /></strong></p>
                            <center><h2>ККМ SALYK.STORE v1.0</h2></center>
                            <p style={{textAlign: 'left'}}><strong>ККМ SALYK.STORE v1.0 - </strong>это кроссплатформенный виртуальный кассовый аппарат, который представляет собой программное обеспечение скачиваемое в PlayMarket и возможностью входа через сайт с браузера (персональный/переносной компьютер, мобильный телефон и другие аналогичные аппараты), принадлежащие субъекту предпринимательства, с помощью которого будут проводится кассовые операции.</p>
                            <p style={{textAlign: 'left'}}><strong>Кассовые операции: </strong>продажа, покупка, возврат продажи, возврат покупки, аванс, консигнация, возврат консигнации, аванс, кредит, возврат кредита, изъятие, закрытие смены.</p>
                            <p style={{textAlign: 'left'}}><strong>Отчеты: </strong>Х-отчет, Z-отчет, отчет по кассирам <span style={{fontWeight: 400}}>(без гашения с итогами по кассе на момент снятия отчета), отчет по секциям (без гашения с итогами по кассе на момент снятия отчета), кассовая лента за смену (за смену на момент снятия отчета), просмотр истории чеков в кассе.</span></p>
                            <p style={{textAlign: 'left'}}><span style={{fontWeight: 400}}><strong>Масштабирование:</strong> неограниченное количество касс в организации, неограниченное количество кассиров в организации, проведение кассовых операций с любого устройства поддерживающего работу с браузером, мобильное приложение для Android и IOS.</span></p>
                            <p style={{textAlign: 'left'}}>&nbsp;</p>
                            <h2 style={{textAlign: 'center'}}><strong>Преимущества ККМ SALYK.STORE v1.0</strong></h2>
                            <table>
                                <tbody>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/global-network.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Мобильность: </strong><span style={{fontWeight: 400}}>возможность управления продажами со смартфона из любой точки мира, контроль рабочего времени, открытия и закрытия смен, касс, возвратов и другие возможности.</span></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/integration (1).png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Универсальный:<span style={{fontWeight: 400}}> подходит для всех отраслей и бизнеса любого масштаба. Касса интегрируется со всеми популярными учетными системами, торговым оборудованием и принтерами. Программу освоят как новички, так и те, кто раньше работал с кнопочной кассой.</span></strong></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/settings.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Простые и интуитивно понятные настройки: </strong><span style={{fontWeight: 400}}>SALYK.STORE предлагает клиентам дополнительные сервисы и функции, которые могут облегчить работу и сэкономить на дорогом оборудовании.</span></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/shield.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Надежность:</strong><span style={{fontWeight: 400}}> Процесс сделки (работа с приложением), его регистрация и обмен данных об этом по сети между участвующими субъектами происходит в считанные доли секунды. Наше оборудование и технологии позволяют выдерживать высокую нагрузку, и может работать неограниченное время в режиме офлайн.</span></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/lock.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Безопасность:<span style={{fontWeight: 400}}> Весь обмен данных ведется по зашифрованным каналам связи и работа на современном оборудовании.</span></strong></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/12123.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Поддержка 24/7:</strong><span style={{fontWeight: 400}}> Специалисты помогают быстро зарегистрировать кассу, подключиться к ОФД и начать работу. Наши специалисты круглосуточно готовы помочь и проконсультировать вас по всем вопросам относительно услуг ОФД SALYK.STORE</span></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/globe (1).png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>География:<span style={{fontWeight: 400}}> Услуги ОФД SALYK.STORE оказывают на всей территории Кыргызской Республики.</span></strong></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/bar-chart.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Статистика и аналитика:<span style={{fontWeight: 400}}> вы видите подробную статистику по продажам, товарам, кассирам и тд...</span></strong></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/cloud-network (1).png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Резервное хранилище:</strong><span style={{fontWeight: 400}}> Вся информация об операциях хранится до 5 лет как у участников операции так и создаются её резервные копии в сервере ОФД</span></p>
                                    </td>
                                </tr>
                                <tr style={{height: '80px'}}>
                                    <td><img src={`${urlMain}/privet/phone.png`} width={70} height={70} /></td>
                                    <td>
                                        <p><strong>Удобство обслуживания клиента:<span style={{fontWeight: 400}}> электронный чек можно выслать клиенту на почту, в любой мессенджер, а при необходимости распечатать на мобильном принтере.</span></strong></p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <p style={{textAlign: 'left'}}>&nbsp;</p>
                            <h2 style={{textAlign: 'center'}}>Стоимость услуг и тарифы ОФД SALYK.STORE</h2>
                            <center>
                                <table style={{borderCollapse: 'collapse', width: '100%', height: '162px', maxWidth: 800}} border={1}>
                                    <tbody>
                                    <tr style={{height: '18px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '18px'}}>№</td>
                                        <td style={{width: '46.4345%', height: '18px', textAlign: 'center'}}><strong>Услуга/Тариф</strong></td>
                                        <td style={{width: '48.0928%', height: '18px', textAlign: 'center'}}><strong>Цена, сом (с учетом налогов)</strong></td>
                                    </tr>
                                    <tr style={{height: '54px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '54px'}}>1</td>
                                        <td style={{width: '46.4345%', height: '54px', textAlign: 'left'}}>Оформление Договора о предоставлении услуг ОФД SALYK.STORE</td>
                                        <td style={{width: '48.0928%', height: '54px', textAlign: 'right'}}>200</td>
                                    </tr>
                                    <tr style={{height: '36px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '36px'}}>2</td>
                                        <td style={{width: '46.4345%', height: '36px', textAlign: 'left'}}>Регистрация, перерегистрация и снятие с регистрации ККМ</td>
                                        <td style={{width: '48.0928%', height: '36px', textAlign: 'right'}}>Бесплатно</td>
                                    </tr>
                                    <tr style={{height: '18px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '18px'}}>3</td>
                                        <td style={{width: '46.4345%', height: '18px', textAlign: 'left'}}>Обслуживание и техническая поддержка</td>
                                        <td style={{width: '48.0928%', height: '18px', textAlign: 'right'}}>Бесплатно</td>
                                    </tr>
                                    <tr style={{height: '18px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '18px'}}>4</td>
                                        <td style={{width: '46.4345%', height: '18px'}}>
                                            <p style={{textAlign: 'left'}}>Интеграция с CRM и тд...</p>
                                            <p style={{textAlign: 'left'}}><strong>Тарифный план "Персональный"</strong></p>
                                        </td>
                                        <td style={{width: '48.0928%', height: '18px', textAlign: 'right'}}>Согласно тарифам на оказание дополнительных услуг/договорная</td>
                                    </tr>
                                    <tr style={{height: '18px'}}>
                                        <td style={{width: '5.47262%', textAlign: 'center', height: '18px'}}>5</td>
                                        <td style={{width: '46.4345%', height: '18px'}}>
                                            <p style={{textAlign: 'left'}}><strong>Тарифный план "Стандарт"</strong></p>
                                            <p style={{textAlign: 'left'}}>Рассчитывается по формуле 150+250*n, где n - количестко ККМ.</p>
                                            <p style={{textAlign: 'left'}}>150 - ежемесячная плата за услуги ОФД</p>
                                            <p style={{textAlign: 'left'}}>250 - абонентская плата за доступ к приложению</p>
                                            <p style={{textAlign: 'left'}}>Таким образом, размер ежемесячной абонентской платы будет составлять:</p>
                                            <p style={{textAlign: 'left'}}><span style={{textDecoration: 'underline'}}>ОФД + 1 ККМ 400 сомов</span></p>
                                            <p style={{textAlign: 'left'}}><span style={{textDecoration: 'underline'}}>ОФД + 2 ККМ 650 сомов</span></p>
                                            <p style={{textAlign: 'left'}}><span style={{textDecoration: 'underline'}}>ОФД + 3 ККМ 900 сомов</span></p>
                                        </td>
                                        <td style={{width: '48.0928%', height: '18px'}}>
                                            <p style={{textAlign: 'right'}}><strong>*Предусматриваются скидки в случае предоплаты:</strong></p>
                                            <p style={{textAlign: 'right'}}>6 месяцев - 10%</p>
                                            <p style={{textAlign: 'right'}}>12 месяцев -20%</p>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </center>
                            <p style={{textAlign: 'center'}}><strong><em>* Первый месяц услуги в тарифном плане "Стандарт" доступны совершенно бесплатно!</em></strong></p>
                            <h2 style={{textAlign: 'center'}}>Как подключиться к ОФД SALYK.STORE</h2>
                            <p>Заключить Договор о предоставлении услуг ОФД SALYK.STORE можно в офисе компании по адресу: проспект Манаса 40, 3-этаж, 317 кабинет.</p>
                            <p>Заполнив заявку на сайте <a href='https://www.salyk.store'>www.salyk.store</a>&nbsp;или скачав мобильное приложение Salyk.store в PlayMarket. Наши специалисты свяжутся по указанным клиентом данным и зарегистрируют онлайн-ККМ. Так же можете связаться с нами по следующим контактам</p>
                            <p><img src={`${urlMain}/privet/phone-call.png`} width={20} height={20} />&nbsp;Тел: <a href='tel:+996559995197'>+996559995197</a>, <a href='tel:+996554776667'>+996554776667</a>, <a href='tel:+996705604020'>+996705604020</a>, <a href='tel:+996990604020'>+996990604020</a>, <a href='tel:+996774604020'>+996774604020</a></p>
                            <p><img src={`${urlMain}/privet/mail.png`} width={20} height={20} />&nbsp;Email: <a href='mailto:salykstore@gmail.com'>salykstore@gmail.com</a></p>
                            <h2 style={{textAlign: 'center'}}>Перечень документов для заключения Договора об оказании услуг</h2>
                            <p><img src={`${urlMain}/privet/man-in-suit-and-tie.png`} width={44} height={44} /></p>
                            <p><strong>&nbsp;Для Юридических лиц:</strong></p>
                            <p>1. Копия свидетельства о государственной регистрации юридического лица;</p>
                            <p>2. Устав, учредительный договор;</p>
                            <p>3. Копия документа, подтверждающего полномочия представителя на заключение Договора (Устав, доверенность или др. документ);</p>
                            <p>4. Паспорт гражданина КР - ID карта;</p>
                            <p>5. Копия ИНН (в случае если в свидетельстве о регистрации не указан ИНН);</p>
                            <p>6. Банковские реквизиты (наименование банка, расчетный счет, БИК, ГНИ);</p>
                            <p>7. Печать организации для предоставления в регистрационном договоре;</p>
                            <p>8. Регистрационные сведения о налогоплательщика (FORM STI-024) (необязательный документ);</p>
                            <p>9. Регистрационная карта налогоплательщика (FORM STI-025) (необязательный документ);</p>
                            <p>&nbsp;</p>
                            <p><img src={`${urlMain}/privet/avatar.png`} width={44} height={44} />&nbsp;</p>
                            <p><strong>Для физических лиц:</strong></p>
                            <p>1. Копия свидетельства о регистрации в качестве индивидуального предпринимателя или патента на осуществление предпринимательской деятельностью с квитанцией об уплате налога;</p>
                            <p>2. Паспорт гражданина КР - ID карта</p>
                            <p>3. Регистрационные сведения о налогоплательщике (FORM STI-024) (необязательный документ)</p>
                            <p>4. Регистрационная карта налогоплательщика (FORM STI-025) (необязательный документ).</p>
                            <p>&nbsp;</p>
                        </div>
                            :
                        ['admin', 'superadmin', 'оператор', 'инспектор', 'агент'].includes(profile.role)?
                            <Card className={classes.message} style={{width: isMobileApp?300:500, height: isMobileApp?300:500}}>
                                <CardContent>
                                    <center>
                                        <img className={classes.logo} src={`${urlMain}/512x512.png`} />
                                    </center>
                                    <br/>
                                    Для начала выберите пункт в боковом меню
                                </CardContent>
                            </Card>
                            :
                            ['кассир', 'управляющий', 'супервайзер'].includes(profile.role)?
                                <>
                                {
                                    list&&list.length?
                                        <>
                                        {list.map((element, idx)=>
                                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardWorkshiftPlaceholder height={height}/>}>
                                                <CardWorkshift element={element} idx={idx}/>
                                            </LazyLoad>
                                        )}
                                        {
                                            ['управляющий', 'супервайзер'].includes(profile.role)?
                                                <div className='count'>
                                                    {`Всего: ${list.length}`}
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            'кассир'===profile.role&&!expired?
                                                <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD} style={{height: 80, justifyContent: 'center'}}>
                                                    <div className={classes.row} style={{
                                                        width: '100%',
                                                        maxWidth: 400
                                                    }}>
                                                        <TextField variant='standard'
                                                            type={isMobileApp?'number':'text'}
                                                            label='Сумма к оплате'
                                                            value={allAmount?allAmount:''}
                                                            className={classes.input}
                                                            onFocus={()=>setAllAmount('')}
                                                            onChange={(event)=>{
                                                                setAllAmount(inputFloat(event.target.value))
                                                            }}
                                                            onKeyPress={event => {
                                                                if (event.key === 'Enter') {
                                                                    allAmount = checkFloat(allAmount)
                                                                    if (allAmount > 0) {
                                                                        let ndsType = legalObject.ndsType
                                                                        let nspType = legalObject.nspType
                                                                        let allPrecent = 100 + ndsTypes[ndsType] + nspTypes[nspType]
                                                                        let allNds = checkFloat(allAmount / allPrecent * ndsTypes[ndsType])
                                                                        let allNsp = checkFloat(allAmount / allPrecent * nspTypes[nspType])
                                                                        let items = [{
                                                                            name: '',
                                                                            unit: 'шт',
                                                                            count: 1,
                                                                            price: allAmount,
                                                                            amountStart: allAmount,
                                                                            discount: '',
                                                                            discountType: 'сом',
                                                                            extra: '',
                                                                            extraType: 'сом',
                                                                            amountEnd: allAmount,
                                                                            nds: allNds,
                                                                            nsp: allNsp
                                                                        }]
                                                                        setMiniDialog('Оплата', <Buy
                                                                            ndsPrecent={ndsTypes[legalObject.ndsType]}
                                                                            nspPrecent={nspTypes[legalObject.nspType]}
                                                                            setAllAmount={setAllAmount}
                                                                            amountStart={allAmount}
                                                                            items={items}
                                                                            allNsp={allNsp}
                                                                            allNds={allNds}
                                                                            consignation={0}
                                                                            usedPrepayment={0}
                                                                            type='Продажа'/>)
                                                                        showMiniDialog(true)
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <IconButton aria-label='scanner' onClick={async ()=>{
                                                            allAmount = checkFloat(allAmount)
                                                            if (allAmount > 0) {
                                                                let ndsType = legalObject.ndsType
                                                                let nspType = legalObject.nspType
                                                                let allPrecent = 100+ndsTypes[ndsType]+nspTypes[nspType]
                                                                let allNds = checkFloat(allAmount / allPrecent * ndsTypes[ndsType])
                                                                let allNsp = checkFloat(allAmount / allPrecent * nspTypes[nspType])
                                                                let items = [{
                                                                    name: '',
                                                                    unit: 'шт',
                                                                    count: 1,
                                                                    price: allAmount,
                                                                    amountStart: allAmount,
                                                                    discount: '',
                                                                    discountType: 'сом',
                                                                    extra: '',
                                                                    extraType: 'сом',
                                                                    amountEnd: allAmount,
                                                                    nds: allNds,
                                                                    nsp: allNsp,
                                                                    ndsType,
                                                                    nspType
                                                                }]
                                                                setMiniDialog('Оплата', <Buy
                                                                                             ndsPrecent={ndsTypes[legalObject.ndsType]}
                                                                                             nspPrecent={nspTypes[legalObject.nspType]}
                                                                                             amountStart={allAmount}
                                                                                             setAllAmount={setAllAmount}
                                                                                             items={items}
                                                                                             allNsp={allNsp}
                                                                                             allNds={allNds}
                                                                                             consignation={0}
                                                                                             usedPrepayment={0}
                                                                                             type='Продажа'/>)
                                                                showMiniDialog(true)
                                                            }
                                                        }}>
                                                            <PointofsaleIcon fontSize='large' style={allAmount>0?{color: '#10183D'}:{}}/>
                                                        </IconButton>

                                                    </div>
                                                </div>
                                                :
                                                null
                                        }
                                        </>
                                        :
                                        'кассир'===profile.role?
                                            <Card className={classes.message} style={{width: isMobileApp?300:500, height: isMobileApp?300:500}}>
                                                <CardContent>
                                                    <center>
                                                        <Button size='large' color={cashbox?'primary':'secondary'} onClick={()=>{
                                                            setMiniDialog('Выберите кассу', <SetCashbox free/>)
                                                            showMiniDialog(true)
                                                        }}>
                                                            {cashbox?cashbox.name:'Выберите кассу'}
                                                        </Button>
                                                    </center>
                                                    {
                                                        cashbox?
                                                            <center>
                                                                <Button size='large' color='primary' onClick={async ()=>{
                                                                    showLoad(true)
                                                                    list = await startWorkShift({cashbox: cashbox._id})
                                                                    showLoad(false)
                                                                    if(list)
                                                                        setList([list])
                                                                    else
                                                                        showSnackBar('Ошибка', 'error')
                                                                }}>
                                                                    Начать смену
                                                                </Button>
                                                            </center>
                                                            :
                                                            null
                                                    }
                                                </CardContent>
                                            </Card>
                                            :
                                            null
                                }

                                </>
                                :
                                null
                }
            </div>
        </App>
    )
})

Index.getInitialProps = wrapper.getInitialPageProps(store => async(ctx) => {
    await initialApp(ctx, store)
    if(store.getState().user.profile.legalObject)
        store.getState().app.legalObject = await getLegalObject({_id: store.getState().user.profile.legalObject}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            ...['кассир', 'управляющий', 'супервайзер'].includes(store.getState().user.profile.role)? {
                list: await getWorkShifts({filter: 'active'}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
            }:{}
        }
    };
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);