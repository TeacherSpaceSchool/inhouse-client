if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let n={};const d=e=>c(e,t),r={module:{uri:t},exports:n,require:d};s[t]=Promise.all(a.map((e=>r[e]||d(e)))).then((e=>(i(...e),n)))}}define(["./workbox-8d624723"],(function(e){"use strict";importScripts("/sw-push-listener.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/192x192.png",revision:"3d636c34e5e9164b7f670290f56f47aa"},{url:"/512x512.png",revision:"3ef1c75e07aa04020172a4110a20c763"},{url:"/_next/static/78l-ZQZlF4fNk78IagoFq/_buildManifest.js",revision:"5c103b00de47ff1ec0207b93aa53edf6"},{url:"/_next/static/78l-ZQZlF4fNk78IagoFq/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/78l-ZQZlF4fNk78IagoFq/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0fe94c24.edea99a6669cd154.js",revision:"edea99a6669cd154"},{url:"/_next/static/chunks/1216-b6d878b66b34edbb.js",revision:"b6d878b66b34edbb"},{url:"/_next/static/chunks/1782-0ff16f46d873d804.js",revision:"0ff16f46d873d804"},{url:"/_next/static/chunks/2109-b4c10a32117d5606.js",revision:"b4c10a32117d5606"},{url:"/_next/static/chunks/2546.3ea75751e629613d.js",revision:"3ea75751e629613d"},{url:"/_next/static/chunks/2620-1658d5d473e44573.js",revision:"1658d5d473e44573"},{url:"/_next/static/chunks/2835-2671aefc5775d272.js",revision:"2671aefc5775d272"},{url:"/_next/static/chunks/313-0f6f9dd4b0f20474.js",revision:"0f6f9dd4b0f20474"},{url:"/_next/static/chunks/6766.9b661530e919af41.js",revision:"9b661530e919af41"},{url:"/_next/static/chunks/6820-1e770739490804b9.js",revision:"1e770739490804b9"},{url:"/_next/static/chunks/6a6ddea2.b183a87325fc9a0a.js",revision:"b183a87325fc9a0a"},{url:"/_next/static/chunks/7353-5460341e7a92edad.js",revision:"5460341e7a92edad"},{url:"/_next/static/chunks/7929-965cd9d9f63c7921.js",revision:"965cd9d9f63c7921"},{url:"/_next/static/chunks/7937-714c6f09dd96f8ed.js",revision:"714c6f09dd96f8ed"},{url:"/_next/static/chunks/8f593d46-cb36eedcb0f113d5.js",revision:"cb36eedcb0f113d5"},{url:"/_next/static/chunks/9505-4c5286d9625df46a.js",revision:"4c5286d9625df46a"},{url:"/_next/static/chunks/framework-79bce4a3a540b080.js",revision:"79bce4a3a540b080"},{url:"/_next/static/chunks/main-9fa5b605d3584b0d.js",revision:"9fa5b605d3584b0d"},{url:"/_next/static/chunks/pages/404-f3c498dde9955ffb.js",revision:"f3c498dde9955ffb"},{url:"/_next/static/chunks/pages/_app-69dee6045c23d4ff.js",revision:"69dee6045c23d4ff"},{url:"/_next/static/chunks/pages/_error-909fc534fba9168a.js",revision:"909fc534fba9168a"},{url:"/_next/static/chunks/pages/balanceclients-6f705d2082075114.js",revision:"6f705d2082075114"},{url:"/_next/static/chunks/pages/balanceitemdays-d4d331453226d610.js",revision:"d4d331453226d610"},{url:"/_next/static/chunks/pages/balanceitems-2cf4c6f0844cc310.js",revision:"2cf4c6f0844cc310"},{url:"/_next/static/chunks/pages/bonuscpas-019dce29c81c8c6b.js",revision:"019dce29c81c8c6b"},{url:"/_next/static/chunks/pages/bonusmanagers-ff392aff4fd8417d.js",revision:"ff392aff4fd8417d"},{url:"/_next/static/chunks/pages/cashboxes-acc2e81a7b6cbf71.js",revision:"acc2e81a7b6cbf71"},{url:"/_next/static/chunks/pages/catalog-556bc75cbb00ba84.js",revision:"556bc75cbb00ba84"},{url:"/_next/static/chunks/pages/categories-ffee98bddd80c3fe.js",revision:"ffee98bddd80c3fe"},{url:"/_next/static/chunks/pages/characteristics-0a16ac3a5ae0ee41.js",revision:"0a16ac3a5ae0ee41"},{url:"/_next/static/chunks/pages/client/%5Bid%5D-0bce5452e79b30aa.js",revision:"0bce5452e79b30aa"},{url:"/_next/static/chunks/pages/clients-d36acf1b3c24850f.js",revision:"d36acf1b3c24850f"},{url:"/_next/static/chunks/pages/consultations-2da7ad3a26ded136.js",revision:"2da7ad3a26ded136"},{url:"/_next/static/chunks/pages/cpa/%5Bid%5D-716cf48862d3956b.js",revision:"716cf48862d3956b"},{url:"/_next/static/chunks/pages/cpas-dd5e3cbdb4c08ef0.js",revision:"dd5e3cbdb4c08ef0"},{url:"/_next/static/chunks/pages/deliveries-01abbad06f07b807.js",revision:"01abbad06f07b807"},{url:"/_next/static/chunks/pages/delivery/%5Bid%5D-516221e1fd9f5f41.js",revision:"516221e1fd9f5f41"},{url:"/_next/static/chunks/pages/doc-2d3a7b8a5d3433b3.js",revision:"2d3a7b8a5d3433b3"},{url:"/_next/static/chunks/pages/errors-d7c8c6fc53f077da.js",revision:"d7c8c6fc53f077da"},{url:"/_next/static/chunks/pages/factorys-4329484d63ec37ab.js",revision:"4329484d63ec37ab"},{url:"/_next/static/chunks/pages/faqs-e2d7c053f93f64d3.js",revision:"e2d7c053f93f64d3"},{url:"/_next/static/chunks/pages/index-ed156cf9c7bc26a5.js",revision:"ed156cf9c7bc26a5"},{url:"/_next/static/chunks/pages/installments-5b434b457b3ac652.js",revision:"5b434b457b3ac652"},{url:"/_next/static/chunks/pages/item/%5Bid%5D-3a225198cc4fec6b.js",revision:"3a225198cc4fec6b"},{url:"/_next/static/chunks/pages/items-572d6e5986a11584.js",revision:"572d6e5986a11584"},{url:"/_next/static/chunks/pages/moneyarticles-49625552c6a70a04.js",revision:"49625552c6a70a04"},{url:"/_next/static/chunks/pages/moneyflows-d9ae7c51610c401c.js",revision:"d9ae7c51610c401c"},{url:"/_next/static/chunks/pages/moneyrecipients-d0778bac75d610e7.js",revision:"d0778bac75d610e7"},{url:"/_next/static/chunks/pages/order/%5Bid%5D-02e9620b5da427d5.js",revision:"02e9620b5da427d5"},{url:"/_next/static/chunks/pages/orders-24b1513e0b689cb9.js",revision:"24b1513e0b689cb9"},{url:"/_next/static/chunks/pages/promotions-0ddc643f731c969f.js",revision:"0ddc643f731c969f"},{url:"/_next/static/chunks/pages/refund/%5Bid%5D-86173b35ded32da3.js",revision:"86173b35ded32da3"},{url:"/_next/static/chunks/pages/refund/new-e57bb821a14b7db1.js",revision:"e57bb821a14b7db1"},{url:"/_next/static/chunks/pages/refunds-5ca81dbebd227794.js",revision:"5ca81dbebd227794"},{url:"/_next/static/chunks/pages/reservation/%5Bid%5D-57dbed723bf6d5ba.js",revision:"57dbed723bf6d5ba"},{url:"/_next/static/chunks/pages/reservations-891fcaff5317513e.js",revision:"891fcaff5317513e"},{url:"/_next/static/chunks/pages/salarys-13798d49f2b1035a.js",revision:"13798d49f2b1035a"},{url:"/_next/static/chunks/pages/sale/%5Bid%5D-370861e74a9a5287.js",revision:"370861e74a9a5287"},{url:"/_next/static/chunks/pages/sales-d32364509b093d41.js",revision:"d32364509b093d41"},{url:"/_next/static/chunks/pages/storebalanceitems-3d3b4265de55e61e.js",revision:"3d3b4265de55e61e"},{url:"/_next/static/chunks/pages/stores-df1b8a8ee743233d.js",revision:"df1b8a8ee743233d"},{url:"/_next/static/chunks/pages/task/%5Bid%5D-1893500bdf825134.js",revision:"1893500bdf825134"},{url:"/_next/static/chunks/pages/tasks-8438d651939c2101.js",revision:"8438d651939c2101"},{url:"/_next/static/chunks/pages/typecharacteristics-1772329ec6cf8fc9.js",revision:"1772329ec6cf8fc9"},{url:"/_next/static/chunks/pages/user/%5Bid%5D-6b108d011ffbe91a.js",revision:"6b108d011ffbe91a"},{url:"/_next/static/chunks/pages/users-1f6f43dbc2f03468.js",revision:"1f6f43dbc2f03468"},{url:"/_next/static/chunks/pages/warehouses-6330fe5d8b28cd9e.js",revision:"6330fe5d8b28cd9e"},{url:"/_next/static/chunks/pages/wayitems-734a7ab83db83976.js",revision:"734a7ab83db83976"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-d168c868b1e405dd.js",revision:"d168c868b1e405dd"},{url:"/_next/static/css/3d69e6f92429884a.css",revision:"3d69e6f92429884a"},{url:"/add.png",revision:"9be5bcbf2e0c7be93e88850d716374c6"},{url:"/alert.mp3",revision:"594e6e429f66513a2bc759fce6c1abc7"},{url:"/favicon.ico",revision:"c9f4d50bf33eab1bf8738608abdf825c"},{url:"/manifest.json",revision:"5cd461e83a3d5f4bdf9d3c2972ba2259"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^http?.*\/images\/.*/,new e.NetworkOnly,"GET"),e.registerRoute(/^https?.*/,new e.NetworkFirst({cacheName:"cache",plugins:[new e.ExpirationPlugin({maxAgeSeconds:432e3})]}),"GET")}));
