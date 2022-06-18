export let urlGQL
export let urlGQLws
export let urlMain
export let urlSubscribe
export let applicationKey
export let urlGQLSSR

if(process.env.URL!=='localhost') {
    urlGQLSSR = `http://localhost:4444/graphql`
    urlGQL = `https://${process.env.URL}:3000/graphql`
    urlGQLws = `wss://${process.env.URL}:3000/graphql`
    urlSubscribe = `https://${process.env.URL}:3000/subscribe`
    urlMain = `https://${process.env.URL}`
    applicationKey = 'BJ1b5m45C1SyLrP3UJ4FXOIXBt8r965KUBct_ioABMGNhgqbQupYpo2n5xhYkwK8tfK6B7JCLLbyzo_IiX0RfgI'
}
else {
    urlGQLSSR = `http://localhost:3000/graphql`
    urlGQL = `http://${process.env.URL}:3000/graphql`
    urlGQLws = `ws://${process.env.URL}:3000/graphql`
    urlMain = `http://${process.env.URL}`
    urlSubscribe = `http://${process.env.URL}:3000/subscribe`
    applicationKey = 'BLPqo5HQhVWD0FbVqJNC7qiQ0JwigC9hIRXFmbY1K0eXCROhYDZY1uqtN4ZKxZ8ZEbFeBffa8k2Bj64aBtRb9Ew'
}

export const regTypes = [
    'Первичная регистрация',
    'Перерегистрация',
    'Снятие с регистрации'
]

export const ndsTypes = {
    'Без НДС': 0,
    'Ставка НДС 12%': 12,
    'Ставка НДС 0%': 0,
    'Освобожденная от НДС': 0
}

export const nspTypes  = {
    'Без НСП': 0,
    'НСП 0%': 0,
    'НСП 1%': 1,
    'НСП 2%': 2,
    'НСП 3%': 3,
    'НСП 5%': 5,
}

export const rateTaxes  = [
    'Упрощенный налоговый режим',
    'Общий налоговый режим',
]

export const taxpayerTypes = [
    'Юридическое лицо' ,
    'Физическое лицо'
]

export const paymentTypes = [
    'Наличными' ,
    'Безналичными'
]

export const ugnsTypes = {
    'Октябрьский район': '001',
    'Ленинский район': '002',
    'Свердловский район': '003',
    'Первомайский район': '004',
    'Аламудунский район': '005',
    'Кеминский район': '007',
    'Ысык-Атинский район': '008',
    'Жайылский район': '009',
    'Московский район': '010',
    'Панфиловский район': '011',
    'Сокулукский район': '012',
    'Чуйский район': '013',
    'Иссык-Кульский район': '014',
    'Аксуйский район': '015',
    'Тонский район': '016',
    'Жети-Огузский район': '017',
    'Тюпский район': '018',
    'г.Каракол': '019',
    'г.Балыкчы': '020',
    'Алайский район': '021',
    'Чон-Алайский район': '022',
    'Араванский район': '023',
    'Баткенский район': '024',
    'Кара-Суйский район': '025',
    'Лейлекский район': '026',
    'Ноокатский район': '027',
    'Кара-Кульджинский район': '028',
    'Узгенский район': '029',
    'Кадамжайский район': '030',
    'г.Кызылкия': '031',
    'г.Ош': '032',
    'г.Сулюкта': '033',
    'Ак-Талинский район': '034',
    'Ат-Башинский район': '035',
    'Кочкорский район': '036',
    'Жумгальский район': '037',
    'Нарынский район': '038',
    'Сузакский район': '039',
    'Ноокенский район': '040',
    'Ала-Букинский район': '041',
    'Токтогульский район': '042',
    'Аксыйский район': '043',
    'Тогуз-Тороуский район': '044',
    'Базар-Коргонский район': '045',
    'Чаткалский район': '047',
    'г.Джалал-Абад': '048',
    'г. Таш-Кумыр': '049',
    'г.Майлы-Суу': '050',
    'г.Кара-Куль': '052',
    'Таласский район': '053',
    'Бакай-Атинский район': '054',
    'Кара-Бууринский район': '055',
    'Манасский район': '056',
    'г.Талас': '057',
    'г.Токмок': '058',
    'г.Нарын': '059',
    'г.Баткен': '060',
    'УККН ЮГ': '997',
    'УГНС по контролю за субъектами СЭЗ г.Бишкек': '998',
    'УГНС по ККН': '999'
}

export const ugnsTypesByNmr = {
    '001': 'Октябрьский район',
    '002': 'Ленинский район',
    '003': 'Свердловский район',
    '004': 'Первомайский район',
    '005': 'Аламудунский район',
    '007': 'Кеминский район',
    '008': 'Ысык-Атинский район',
    '009': 'Жайылский район',
    '010': 'Московский район',
    '011': 'Панфиловский район',
    '012': 'Сокулукский район',
    '013': 'Чуйский район',
    '014': 'Иссык-Кульский район',
    '015': 'Аксуйский район',
    '016': 'Тонский район',
    '017': 'Жети-Огузский район',
    '018': 'Тюпский район',
    '019': 'г.Каракол',
    '020': 'г.Балыкчы',
    '021': 'Алайский район',
    '022': 'Чон-Алайский район',
    '023': 'Араванский район',
    '024': 'Баткенский район',
    '025': 'Кара-Суйский район',
    '026': 'Лейлекский район',
    '027': 'Ноокатский район',
    '028': 'Кара-Кульджинский район',
    '029': 'Узгенский район',
    '030': 'Кадамжайский район',
    '031': 'г.Кызылкия',
    '032': 'г.Ош',
    '033': 'г.Сулюкта',
    '034': 'Ак-Талинский район',
    '035': 'Ат-Башинский район',
    '036': 'Кочкорский район',
    '037': 'Жумгальский район',
    '038': 'Нарынский район',
    '039': 'Сузакский район',
    '040': 'Ноокенский район',
    '041': 'Ала-Букинский район',
    '042': 'Токтогульский район',
    '043': 'Аксыйский район',
    '044': 'Тогуз-Тороуский район',
    '045': 'Базар-Коргонский район',
    '047': 'Чаткалский район',
    '048': 'г.Джалал-Абад',
    '049': 'г. Таш-Кумыр',
    '050': 'г.Майлы-Суу',
    '052': 'г.Кара-Куль',
    '053': 'Таласский район',
    '054': 'Бакай-Атинский район',
    '055': 'Кара-Бууринский район',
    '056': 'Манасский район',
    '057': 'г.Талас',
    '058': 'г.Токмок',
    '059': 'г.Нарын',
    '060': 'г.Баткен',
    '997': 'УККН ЮГ',
    '998': 'УГНС по контролю за субъектами СЭЗ г.Бишкек',
    '999': 'УГНС по ККН'
}

export const pTypes = [
    'Автомобильная заправочная станция (АЗС)',
    'Автомобильная газонаполнительная компрессорная станция (АГНКС)',
    'Автомобильная газозаправочная станция (АГЗС)',
    'Магазин (с торговой площадью более 200 кв.м.)',
    'Магазин (с торговой площадью от 100 до 200 кв.м.)',
    'Магазин (с торговой площадью от 50 до 100 кв.м.)',
    'Магазин (с торговой площадью до 50 кв.м.)',
    'Медицинская лаборатория, в т.ч. УЗИ',
    'Медицинский центр (с площадью свыше 150 кв.м.)',
    'Медицинский центр (с площадью до 150 кв.м.)',
    'Кафе/Ресторан/Чайхана и т.д. (с количеством посадочных мест более 200 кв.м.)',
    'Кафе/Ресторан/Чайхана и т.д. (с количеством посадочных мест от 100 до 200 кв.м.)',
    'Кафе/Ресторан/Чайхана и т.д. (с количеством посадочных мест до 100 кв.м.)',
    'Сеть быстрого питания (фаст-фуд)',
    'Бутик/Отдел/Магазин, расположенный в ТЦ (с торговой площадью более 200 кв.м.)',
    'Бутик/Отдел/Магазин, расположенный в ТЦ (с торговой площадью от 100 до 200 кв.м.)',
    'Бутик/Отдел/Магазин, расположенный в ТЦ (с торговой площадью от 50 до 100 кв.м.)',
    'Бутик/Отдел/Магазин, расположенный в ТЦ (с торговой площадью до 50 кв.м.)',
    'Ветеринарная клиника',
    'Ветеринарная аптека',
    'Аптека',
    'Аптечный пункт',
    'Платежный терминал',
    'Вендинговый аппарат',
    'Сауна',
    'Баня',
    'Бильярдный клуб',
    'Обменное бюро',
    'Дискотека/Ночной клуб',
    'Караоке',
    'Круглосуточная автостоянка',
    'Ломбард',
    'Парикмахерская/Салон красоты',
    'Стоматология',
    'Аренда рекламных щитов',
    'Мойка автотранспортных средств',
    'Гостиница',
    'Дом отдыха',
    'Частный коттедж',
    'СТО ',
    'Вулканизация',
    'Нотариус/Адвокатская контора',
    'КОУ (пансионаты, санатории, лагеря и т.п.)',
    'Павильон/Контейнер/Киоск (с площадью более 50 кв.м.)',
    'Авиакасса',
    'Бассейн',
    'Образовательное учреждение (садик, школа, ВУЗ и т.п.)',
    'Интернет клуб',
    'Игровой клуб (игровые приставки)',
    'Кинотеатр',
    'Химчистка',
    'Спортивный зал (фитнес клуб, зал единоборства и т.п.)',
    'Фотосалон',
    'Свадебный салон',
    'Звукозапись',
    'Спортивное поле (футбольное, теннисное, волейбольное и т.п.)',
    'Цирк',
    'Аттракцион',
    'Боулинг',
    'Другие точки торговли',
    'Другие точки оказания услуг',
    'Айыл окмоту',
    'Прочее'
]

export const bTypes = [
    'Розничная торговля широким ассортиментом товаров, в т.ч. продовольственными товарами',
    'Розничная торговля горюче-смазочными материалами',
    'Розничная торговля автомобильным газом',
    'Розничная торговля авиабилетами',
    'Розничная торговля ветеринарными препаратами',
    'Розничная торговля фармацевтическими товарами ',
    'Розничная торговля медицинскими и ортопедическими товарами',
    'Розничная торговля мясом и мясными продуктами',
    'Розничная торговля рыбой, ракообразными и моллюсками',
    'Розничная торговля хлебом, хлебобулочными изделиями, мучными и кондитерскими изделиями из сахара',
    'Розничная торговля алкогольными и неалкогольными напитками',
    'Розничная торговля табачными изделиями',
    'Розничная торговля компьютерами и программным обеспечением',
    'Розничная торговля аудио- и видеоаппаратурой',
    'Розничная торговля бытовыми электротоварами',
    'Розничная торговля текстильными изделиями',
    'Розничная торговля строительными материалами',
    'Розничная торговля коврами и ковровыми изделиями',
    'Розничная торговля мебелью',
    'Розничная торговля осветительными приборами и прочими бытовыми товарами',
    'Розничная торговля книгами',
    'Розничная торговля журналами и канцелярскими товарами',
    'Розничная торговля видео и музыкальными записями (DVD-дисками, видеокассетами, компакт-дисками и т.п.)',
    'Розничная торговля спортивными товарами',
    'Розничная торговля играми и игрушками',
    'Розничная торговля одеждой',
    'Розничная торговля обувью',
    'Розничная торговля косметическими и парфюмерными товарами',
    'Розничная торговля цветами и другими растениями, семенами, удобрениями',
    'Розничная торговля домашними животными (питомцами)',
    'Розничная торговля кормом для животных',
    'Розничная торговля часами и ювелирными изделиями',
    'Розничная торговля запасными частями и материалами к автомобилям',
    'Розничная торговля прочими продовольственными товарами',
    'Розничная торговля прочими непродовольственными товарами',
    'Услуги медицинских лабораторий, в т.ч. УЗИ',
    'Услуги медицинских центров',
    'Услуги общественного питания',
    'Услуги сети быстрого питания (фаст-фуд)',
    'Услуги ветеринаров',
    'Услуги платежных терминалов',
    'Услуги вендинговых аппаратов',
    'Услуги саун',
    'Услуги бань',
    'Услуги бильярдных клубов',
    'Услуги обменных бюро',
    'Услуги дискотек/ночных клубов',
    'Услуги круглосуточных автостоянок',
    'Услуги ломбардов',
    'Услуги парикмахерских и салонов красоты',
    'Услуги стоматологий',
    'Услуги аренды рекламных щитов',
    'Услуги моек автотранспортных средств',
    'Услуги гостиниц, домов отдыхов, частных коттеджей',
    'Услуги технического обслуживания и ремонта автомобилей',
    'Услуги вулканизаций',
    'Услуги нотариусов/адвокатских контор',
    'Услуги КОУ (пансионаты, санатории, лагеря и т.п.)',
    'Услуги бассейнов',
    'Услуги образовательных учреждений (садик, школа, ВУЗ и т.п.)',
    'Услуги интернет клубов',
    'Услуги игровых клубов (игровые приставки)',
    'Услуги кинотеатров',
    'Услуги химчистки',
    'Услуги спортивных залов (фитнес клуб, зал единоборства и т.п.)',
    'Услуги фотосалонов',
    'Услуги спортивных полей (футбольное, теннисное, волейбольное и т.п.)',
    'Услуги цирка',
    'Услуги аттракционов',
    'Услуги боулингов',
    'Услуги звукозаписи',
    'Услуги видеосъемок',
    'Услуги свадебных салонов',
    'Услуги спортивных полей (футбол, баскетбол, волейбол, теннис) ',
    'Услуги аттракционов',
    'Услуги караоке',
    'Оказание прочих услуг',
    'Сбор с населения платежей',
    'Реализация запасных частей и материалов к автомобилям (новых и бывших в употреблении):',
    'реализация сотовых телефонов, запасных частей и деталей к ней с правом привлечения не более 1-го наемного работника',
    'Скупка, ремонт и реализация изделий из драгоценных металлов и камней',
    'Розничная реализация в специализированных магазинах, овощей, фруктов, ягод и других видов растениеводства в натуральном или переработанном виде',
    'Розничная реализация в специализированных магазинах, торговой площадью до 50 кв.м, товаров, инвентаря и снастей охотнично-промыслового назначения (за исключением оружия) и рыболовства',
    'Розничная реализация в специализированных магазинах, торговой площадью до 50 кв.м, мыломоющих средств и парфюмерно-косметических изделий',
    'Розничная реализация на дому газовых баллонов, угля в мешках и дров',
    'Изготовление и реализация готовых мясных блюд из мяса и мяса птиц (шашлык, гриль)',
    'Производство хлеба, хлебобулочных и мучных кондитерских изделий недлительного хранения',
    'Производство пескоблока, шлакоблока и брусчаток на дому',
    'Прочее'
]