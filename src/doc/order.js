import htmlDocx from 'html-docx-js/dist/html-docx';
import { pdDDMMYYYY, checkFloat } from '../lib'
import numberToWord from '../numberToWord'

export const getOrderDoc = async ({sale, client, doc})=>{
    const precentPaid = parseInt(sale.paid*100/(sale.amountEnd-checkFloat(sale.prepaid)))
    const blob = await htmlDocx.asBlob(`
    <p style="text-align:center;font-size:12pt">
      <strong>ДОГОВОР КУПЛИ-ПРОДАЖИ №${sale.number}</strong>
    </p>
    <table style="width:100%">
      <tr style="width: 100%;">
        <td style="width: 50%; font-size: 10pt;">
          <strong>г. Бишкек</strong>
        </td>
        <td style="width: 50%; text-align: right; font-size: 10pt;">
          <strong>${pdDDMMYYYY(sale.createdAt)} г</strong>
        </td>
      </tr>
    </table>
    <p style="text-align:justify;font-size:10pt">${doc.name}, в лице директора ${doc.director}, действующего на основании Устава, именуемое в дальнейшем <strong>Продавец</strong>&nbsp; с одной стороны и <strong>${client.name} ${pdDDMMYYYY(client.birthday)}</strong> года рождения с другой стороны, именуемый в дальнейшем&nbsp; <strong>Покупатель</strong> заключили настоящий Договор о нижеследующем: </p>
    <p style="text-align:center;font-size:10pt">
      <strong>1. ПРЕДМЕТ ДОГОВОРА</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">1.1 Продавец обязуется поставить товар в течение <strong>90 дней со дня получения оплаты.</strong>
    </span>
    <br>
    <span style="text-align:justify;font-size:10pt">1.2 Продавец по согласованию с Покупателем имеет право досрочно доставить товар.</span>
    <p style="text-align:center;font-size:10pt">
      <strong>2. ЦЕНА И СУММА ДОГОВОРА</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">2.1 Поставляемый по настоящему Договору товар, оплачивается по ценам, <strong>согласно спецификации (приложения № 1) являющейся неотъемлемой частью данного договора.</strong></span>
    <br>
    <span style="text-align:justify;font-size:10pt">2.2 Общая стоимость поставляемого по настоящему Договору товара составляет <strong>${(sale.amountEnd-checkFloat(sale.prepaid))} (${await numberToWord((sale.amountEnd-checkFloat(sale.prepaid)), 'all')})</strong> сом.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">2.3 Данная стоимость включает в себя доставку, сборку и установку товара у Покупателя по заранее согласованному адресу.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>3. УСЛОВИЯ ПЛАТЕЖА И ПОСТАВКИ</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">3.1 Расчеты за приобретаемый товар: Покупатель <strong>производит <span>${precentPaid}%</span> оплату</strong>, что составляет <strong>${sale.paid} (${await numberToWord(sale.paid, 'all')})</strong> сом, Покупатель внесет до прихода мебели на склад г. Бишкек. </span>
    <br>
    <span style="text-align:justify;font-size:10pt">3.2 Товар вывозится только после <strong>${precentPaid}% оплаты</strong> суммы настоящего Договора. </span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>4. ПРАВА И ОБЯЗАННОСТИ СТОРОН</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">4.1 Покупатель обязан:</span>
    <br>
    <span style="text-align:justify;font-size:10pt">1) Произвести оплату в соответствии с п.3 настоящего Договора;</span>
    <br>
    <span style="text-align:justify;font-size:10pt">2) Подготовить поверхность помещения для произведения сборки мебели;</span>
    <br>
    <span style="text-align:justify;font-size:10pt">3) Уведомить Продавца в случае изменения условий Приложения №1 (комплектации, отделки, цвета обивки товара, и т.д.), с обязательным внесением изменений в Приложении.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">4) Проинформировать Продавца в течение 5 (пяти) дней с момента получения заказа, в случае если прибывший товар оказывается явно бракованным или не соответствует спецификации Приложения №1.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">4.2. Покупатель в праве:</span>
    <br>
    <span style="text-align:justify;font-size:10pt">1) Требовать от Продавца выполнения условий настоящего Договора.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">4.3. Продавец обязан:</span>
    <br>
    <span style="text-align:justify;font-size:10pt">1) Поставить по настоящему Договору мебель в соответствии с каталогом Продавца и Приложения №1.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">2) В случае изменения (по просьбе Покупателя) комплектации, отделки, цвета обивки товара, и т.д., уведомить последнего о переносе сроков исполнения Договора с возложением на него возможных расходов.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">3) Продавец обязуется в случае невозможности поставки товара, произвести 100% возврат денежных средств Покупателю в течение 30 дней.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">4) При нарушении комплектности, повреждения, либо явного брака Продавец обязуется за свой счет поставить недостающие, поврежденные, либо явно бракованные части и детали.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">5) Произвести бесплатную сборку мебели на подготовленную поверхность помещения. В случаи если доставка и сборка доставленной мебели связаны с дополнительными техническими сложностями, как то: отсутствие или неисправность грузового лифта, неподготовленность помещения для установки мебели, проведение дополнительных работ, связанных с изменением конфигурации поставляемой мебели, работа Продавца подлежит дополнительной оплате.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">6) В случае невозможности сборки и установки мебели по вине Покупателя, например: неподготовленности помещения или по иным другим причинам, товар в любом случае доставляется, а сборка и установка производится в срок, указанный Покупателем, о чем он обязан предупредить за три рабочих дня.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">7) Произвести замену товара в течение 60-ти (шестидесяти) дней со дня получения рекламации от Покупателя о том, что товар явно бракован или не соответствует Приложению №1.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>5. ГАРАНТИЯ КАЧЕСТВА И ПОРЯДОК ПЕРЕДАЧИ ТОВАРА</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">5.1. Продавец гарантирует сервисное обслуживание сроком на один год, при условии соблюдения Покупателем норм хранения и правильной эксплуатации мебели.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">5.2. Продавец передает товар лично Покупателю или лицу, действующему в его интересах и предъявившему Договор и Доверенность от Покупателя.</span>
    <br>
   <span style="text-align:justify;font-size:10pt">5.3. В случаях просрочки доставки заказа, Продавцом предоставляется Покупателю дополнительная скидка от стоимости товара в размере 0,1% за каждый день просрочки доставки, но не более 5% от суммы договора.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>6. ОТВЕТСТВЕННОСТЬ СТОРОН</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">6.1. Продавец несет ответственность по доставке в г. Бишкек, сборке и установке заказанного товара в количестве и комплектности в соответствии с Приложением № 1 и сроки, оговоренные в настоящем Договоре.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">6.2. В случае досрочного расторжения Покупателем Договора в одностороннем порядке или отказе от товара, Продавец организует продажу товара и только после продажи возвращает Покупателю полученную от него предоплату с вычетом стоимости оставшегося непроданного товара, стоимость хранения товара, согласно п.7.2.</span>
    <br>
    <span style="text-align:justify;font-size:10pt;font-weight:bold">6.3. Все дополнительные расходы, связанные со сборкой и монтажом мебели, вне места определенного в п. 2.3 Покупателем оплачиваются отдельно и не входят в стоимость настоящего договора.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>7. ХРАНЕНИЕ ТОВАРА</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">7.1. Срок бесплатного хранения товара после уведомления о поставке (осуществляется устно по телефону) составляет 30 календарных дней</span>
    <br>
    <span style="text-align:justify;font-size:10pt">7.2. При хранении товара более одного календарного месяца без оплаты считается, что Покупатель отказался от товара и Продавец имеет право реализовать товар и после реализации выплатить Покупателю предварительную оплату за вычетом неустойки согласно п.6.3 и п. 7.2.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>8. ФОРС-МАЖОРНЫЕ ОБСТОЯТЕЛЬСТВА</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">8.1. При наступлении обстоятельств невозможности полного или частичного исполнения любой из сторон обязательств по настоящему Договору, а именно стихийные бедствия войны, блокады и т. п. или другие, не зависящие от сторон обстоятельства, обязательства сторон отодвигаются соразмерно времени, в течение которого будут действовать эти обстоятельства или их последствия.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">8.2. Стороны обязуются известить друг друга в случае возникновения обстоятельств, препятствующих исполнению обязательств, предоставлением справок, заверенных органами государственного управления.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>9. ПРОЧИЕ УСЛОВИЯ</strong>
    </p>
    <span style="text-align:justify;font-size:10pt">9.1. Договор может быть изменен, дополнен или расторгнут по соглашению сторон. Все приложения к настоящему Договору оформляются в письменном виде и подписываются уполномоченными представителями. Сторона, решившая прекратить действие настоящего Договора, обязана в письменном виде сообщить об этом другой стороне.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">9.2. Договор вступает в силу с момента подписания и действует до полного исполнения сторонами своих обязательств по данному Договору.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">9.3. Договор составлен на русском языке в 2-х экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">9.4. Во всем остальном, что не предусмотрено настоящим Договором, стороны руководствуются действующим законодательством Кыргызской Республики.</span>
    <br>
    <span style="text-align:justify;font-size:10pt">9.5. Все споры по данному Договору решаются в порядке, установленном законодательством Кыргызской Республики.</span>
    <br>
    <p style="text-align:center;font-size:10pt">
      <strong>10. РЕКВИЗИТЫ СТОРОН</strong>
    </p>
    <table style="width:100%">
      <tr style="width: 100%;">
        <td style="vertical-align: top; width: 50%; font-size: 10pt;">
          <strong>ПОСТАВЩИК: <br>${doc.name} </strong>
        </td>
        <td style="vertical-align: top; width: 50%; font-size: 10pt;">
          <strong>ПОКУПАТЕЛЬ:</strong>
        </td>
      </tr>
      <tr style="width: 100%;">
        <td style="vertical-align: top; width: 50%;">
          <span style="text-align: justify; font-size: 10pt;">Адрес: ${doc.address}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">ИНН: ${doc.inn}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">ОКПО: ${doc.okpo}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">${doc.bank}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">Р/с ${doc.account}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">БИК: ${doc.bik}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">
            <strong>Генеральный директор</strong>
          </span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">
            <strong>${doc.director}</strong>
          </span>
        </td>
        <td style="vertical-align: top; width: 50%;">
          <span style="text-align: justify; font-size: 10pt;">ФИО: ${client.name}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">ИНН: ${client.inn}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">Паспорт: ${client.passport}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">Номер тел: ${client.phones[0]}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">Адрес проживания: ${client.address}</span>
          <br>
          <span style="text-align: justify; font-size: 10pt;">Адрес прописки: ${client.address1}</span>
        </td>
      </tr>
      <tr style="height: 50px;"></tr>
      <tr style="width: 100%;">
        <td style="vertical-align: bottom; width: 50%;">
          <span style="text-align: justify; font-size: 10pt;">Подпись _______________</span>
        </td>
        <td style="vertical-align: bottom; width: 50%;">
          <span style="text-align: justify; font-size: 10pt;">Подпись _______________</span>
        </td>
      </tr>
    </table>
    `);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const id = `donwloadSaleDocs-${sale._id}`
    link.id = id
    link.href = blobUrl;
    link.download = `Договор купли-продажи №${sale.number}.docx`;
    document.body.appendChild(link);
    document.getElementById(id).click()
};
