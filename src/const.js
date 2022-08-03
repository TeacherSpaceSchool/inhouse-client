export let urlGQL
export let urlGQLws
export let urlMain
export let urlSubscribe
export let applicationKey
export let urlGQLSSR

if(process.env.URL!=='localhost') {
    urlGQLSSR = `http://localhost:4000/graphql`
    urlGQL = `https://${process.env.URL}:3000/graphql`
    urlGQLws = `wss://${process.env.URL}:3000/graphql`
    urlSubscribe = `https://${process.env.URL}:3000/subscribe`
    urlMain = `https://${process.env.URL}`
    applicationKey = 'BMzbAELvYxq_uMyHjWYPov41il9lwukAYj2XEX9ZQuwowpHlHINjfiHhihzcKOiA9p72DpHlot0y2ZJFtMnlVhE'
}
else {
    urlGQLSSR = 'http://localhost:3000/graphql'
    urlGQL = 'http://localhost:3000/graphql'
    urlGQLws = 'ws://localhost:3000/graphql'
    urlMain = 'http://localhost'
    urlSubscribe = 'http://localhost:3000/subscribe'
    applicationKey = 'BODCsLjRe580eIOCOESG389UZwLrXTiW_OOnkBoh0T_oAsadUqz_RsNKsp32D8DNZePwVwtrpTv7KgiTGMIQxfE'
}