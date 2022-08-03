import htmlDocx from 'html-docx-js/dist/html-docx';
import { pdDDMMYYYY, pdDDMMYY, pdHHMM, checkFloat } from '../../src/lib'
import numberToWord from '../../src/numberToWord'

export const getInstallmentDoc = async ({client, itemsSale, doc, installment, sale})=>{
    let grid = ''
    for(let i=0; i<installment.grid.length; i++) {
        grid += `<tr style="height: 40px;">
              <td style="border: 1px solid black; text-align: center; width: 19%;">${!i?'Первонач. взнос':i}</td>
              <td style="border: 1px solid black; text-align: center; width: 20%;">${pdDDMMYYYY(installment.grid[i].month)}</td>
              <td style="border: 1px solid black; text-align: center; width: 59%;">
                <strong>${installment.grid[i].amount} (${await numberToWord(installment.grid[i].amount, 'all')})</strong>
              </td>
            </tr>`
    }
    const blob = await htmlDocx.asBlob(`
    <div>
      <p style="text-align:center;font-size:12pt">
        <strong>Договор купли-продажи с рассрочкой платежа №${pdDDMMYY(sale.createdAt)}/${sale.number} (${pdHHMM(sale.createdAt)})</strong>
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
      <p style="text-align:justify;font-size:10pt">${doc.name}, в лице директора ${doc.director}, действующего на основании Устава, именуемое в дальнейшем <strong>Продавец</strong>&nbsp; с одной стороны и гражданин(ка) Кыргызской Республики <strong>${client.name} ${pdDDMMYYYY(client.birthday)}</strong> года рождения с другой стороны, именуемый в дальнейшем&nbsp; <strong>Покупатель</strong> заключили настоящий Договор о нижеследующем: </p>
      <p style="text-align:center;font-size:10pt">
        <strong>1. ПРЕДМЕТ ДОГОВОРА</strong>
      </p>
       ${
        itemsSale&&itemsSale.length?
            `
            <span style="text-align:justify;font-size:10pt">1.1 По настоящему договору Продавец обязуется передать в собственность Покупателю, а Покупатель обязуется принять и оплатить мебель со следующими характеристиками:</span>
            <br>
            <br>
              <table align="center" cellspacing="0" style="border-collapse:collapse;border:none;width:63.22%">
                <tr style="height: 40px;">
                  <td style="border: 1px solid black; text-align: center; width: 52%;">
                    <strong>Модель</strong>
                  </td>
                  <td style="border: 1px solid black; text-align: center; width: 27%;">
                    <strong>Кол-во</strong>
                  </td>
                  <td style="border: 1px solid black; text-align: center; width: 20%;">
                    <strong>Цена (сом)</strong>
                  </td>
                </tr>
                ${itemsSale.map((itemSale) => `<tr style='height: 40px;'>
                  <td style='border: 1px solid black; text-align: center; width: 52%;'>${itemSale.name}</td>
                  <td style='border: 1px solid black; text-align: center; width: 27%;'>${itemSale.count} ${itemSale.unit}</td>
                  <td style='border: 1px solid black; text-align: center; width: 20%;'>${itemSale.amount}</td>
                </tr>`)}
                ${sale.discount?`<tr style='height: 40px;'>
                  <td style='border: 1px solid black; text-align: center; width: 52%;'>Скидка</td>
                  <td style='border: 1px solid black; text-align: center; width: 27%;'></td>
                  <td style='border: 1px solid black; text-align: center; width: 20%;'>${checkFloat(sale.discount*100/sale.amountStart)}%</td>
                </tr>`:''}
                <tr style="height: 40px;">
                  <td style="border: 1px solid black; text-align: center; width: 52%;">
                    <strong>Итого:</strong>
                  </td>
                  <td style="border: 1px solid black; text-align: center; width: 27%;"></td>
                  <td style="border: 1px solid black; text-align: center; width: 20%;">${sale.amountEnd}</td>
                </tr>
            </table>
            <br>
            `
            :
            '<span style="text-align:justify;font-size:10pt">1.1 По настоящему договору Продавец обязуется передать товары в собственность Покупателю, а Покупатель обязуется принять товары и оплатить рассрочку.</span>\n'
      }
      <span style="text-align:justify;font-size:10pt">Техническое состояние передаваемого Товара: новое (претензий и нареканий со стороны покупателя нет).</span>
      <br>
      <span style="text-align:justify;font-size:10pt">1.2. Товар передаётся Покупателю на условиях раздельной оплаты согласно графику указанного в пункте 3.3 за Товар в порядке, предусмотренном настоящим Договором.</span>
      <br>
      <p style="text-align:center;font-size:10pt">
        <strong>2. ПРАВА И ОБЯЗАННОСТИ СТОРОН</strong>
      </p>
      <span style="text-align:justify;font-size:10pt">2.1. Продавец вправе:</span>
      <br>
      <span style="text-align:justify;font-size:10pt">2.1.1. потребовать возврата Товара в случае ненадлежащего исполнения или неисполнения Покупателем обязательств по Договору.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">2.1.2. в случае просрочки очередного платежа по Договору согласно статье 3 настоящего договора, более чем на 3 дня Продавец праве в одностороннем порядке расторгнуть договор и потребовать возврата Товара у Покупателя.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">2.2. Покупатель обязан:</span>
      <br>
      <span style="text-align:justify;font-size:10pt">2.2.1. Поддерживать надлежащее состояние Товара и использовать его в соответствии с его назначением и согласно техническим правилам эксплуатации.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">2.2.2. Принять на себя все риски, связанные с гибелью, утратой, порчей, хищением, преждевременной поломкой Товара, ошибкой, допущенной при эксплуатации Товара, самостоятельно нести расходы за ущерб и/или вред, причиненный третьим лицам в связи с владением и пользованием Товаром</span>
      <br>
      <p style="text-align:center;font-size:10pt">
        <strong>3. СТОИМОСТЬ ТОВАРА И ПОРЯДОК ОПЛАТЫ</strong>
      </p>
      <span style="text-align:justify;font-size:10pt">3.1. Стоимость Товара составляет <strong>${sale.amountEnd} (${await numberToWord(sale.amountEnd, 'all')}) сом.</strong>
      </span>
      <br>
      <span style="text-align:justify;font-size:10pt">3.2. Покупатель производит оплату первоначального взноса наличными в руки.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">3.3. Покупатель обязуется произвести оплату оставшейся части стоимости Товара путем пополнения электронного кошелька <strong>${doc.wallet}</strong>
      </span>
      <br>
      <span style="text-align:justify;font-size:10pt">Оплата за Товар Продавцу осуществляется по следующему графику:</span>
      <br>
      <br>
      <table align="center" cellspacing="0" style="border-collapse:collapse;border:none;width:88.24%">
        <tr style="height: 40px;">
          <td style="border: 1px solid black; text-align: center; width: 19%;">
            <strong>№</strong>
          </td>
          <td style="border: 1px solid black; text-align: center; width: 20%;">
            <strong>Дата платежа</strong>
          </td>
          <td style="border: 1px solid black; text-align: center; width: 59%;">
            <strong>Сумма платежа (сом)</strong>
          </td>
        </tr>
        ${grid}
        <tr style="height: 40px;">
          <td style="border: 1px solid black; text-align: center; width: 19%;"></td>
          <td style="border: 1px solid black; text-align: center; width: 20%;"></td>
          <td style="border: 1px solid black; text-align: center; width: 59%;">
            <strong>${installment.amount} (${await numberToWord(installment.amount, 'all')})</strong>
          </td>
        </tr>
      </table>
      <br>
      <span style="text-align:justify;font-size:10pt">3.4. Доказательством факта оплаты каждого платежа является фотография квитанции об оплате, отправленная через приложение WhatsApp на номер: <strong>${doc.phoneCheckInstallment}. (Отправить чек и написать ФИО)</strong>
      </span>
      <br>
      <br>
      <p style="text-align:center;font-size:10pt">
        <strong>4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</strong>
      </p>
      <span style="text-align:justify;font-size:10pt">4.1. Настоящий договор составлен в 2 (Двух) экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">4.2. В случае возникновения расхождений по вопросам оплаты, Покупатель обязан представить квитанции об оплате.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">4.3. Условия, не определенные данным договором, определяются нормами гражданского кодекса КР.</span>
      <br>
      <p style="text-align:center;font-size:10pt">
        <strong>5. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ</strong>
      </p>
      <span style="text-align:justify;font-size:10pt">5.1.Покупатель подписывая настоящий договор, подтверждает, что адрес, указанный в реквизитах покупателя настоящего договора является его фактическим местом проживания и все юридически значимые сообщения (уведомления, извещения, повестки) при необходимости будут высылаться по указанному адресу.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">5.2.Покупатель обязуется письменно известить Продавца об изменении фактического адреса путем предоставления справки с нового фактического места жительства. При отсутствии сообщения и справки с нового места жительства, любое юридически значимое сообщение Продавца посылается заказным письмом по адресу указанному в реквизитах Покупателя, и считается доставленной, даже если адресат по этому адресу более не проживает или не находиться.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">5.3. Стороны подписывая настоящий договор пришли к соглашению, что спор, связанный с исполнением настоящего договора, будет рассматриваться по месту нахождения Продавца, в ${doc.court}. При подачи искового заявления или заявления на судебный приказ, любой из сторон будет применять правило договорной подсудности, предусмотренной статьей 34 гражданского процессуального кодекса Кыргызской Республики.</span>
      <br>
      <span style="text-align:justify;font-size:10pt">5.4. Условия, не определенные данным договором, определяются нормами гражданского кодекса Кыргызской Республики.</span>
      <br>
      <br>
      <br>
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
          <span style="text-align: justify; font-size: 10pt;">${doc.director} _______________</span>
        </td>
        <td style="vertical-align: bottom; width: 50%;">
          <span style="text-align: justify; font-size: 10pt;">Подпись _______________</span>
        </td>
      </tr>
    </table>
    </div>
    `);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const id = 'donwloadInstallmentDocs'
    link.id = id
    link.href = blobUrl;
    link.download = `Договор рассрочки №${sale.number}.docx`;
    document.body.appendChild(link);
    document.getElementById(id).click()
};

