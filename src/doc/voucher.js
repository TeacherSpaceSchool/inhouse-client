import htmlDocx from 'html-docx-js/dist/html-docx';
import { pdDDMMYYYY, pdDDMMYY } from '../../src/lib'

export const getVoucherDoc = async ({client, doc, installment})=>{
    const blob = await htmlDocx.asBlob(`
        <p style="text-align: center; font-size: 12pt;">
          <strong>РАСПИСКА</strong>
        </p>
        <table style="width: 100%;">
          <tr style="width: 100%;">
            <td style="width: 50%; font-size: 10pt;">
              <strong>г. Бишкек</strong>
            </td>
            <td style="width: 50%; text-align: right; font-size: 10pt;">
              <strong>${pdDDMMYYYY(installment.createdAt)} г</strong>
            </td>
          </tr>
        </table>
        <center style="font-size: 10pt; width: 100%;">НАСТОЯЩЕЙ РАСПИСКОЙ, Я,</center>
        <span style="text-align: justify; font-size: 10pt;">
          <strong>${client.name}</strong>
        </span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Адрес проживания: ${client.address}</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Адрес прописки: ${client.address1}</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Паспорт: ${client.passport}</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">подтверждаю, что получил(а) у ${doc.name}, действующего на основании Устава товар(ы) согласно представленного выше договора купли-продажи с рассрочкой платежа №${pdDDMMYY(installment.createdAt)}/${installment.number}. В случае возникновения просроченной задолженности не возражаю от публикации моих фотографий и паспортных данных в социальных сетях и мессенджерах. Также обязуюсь соблюдать все условия, в том числе условия оплаты указанные в представленном выше договоре купли-продажи с рассрочкой платежа.</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">ФИО: ___________________________________________________________________________________________</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Дата: _______________________________________________</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Номер телефона Whatsapp: ___________________________________</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Дополнительный номер: _____________________________________</span>
        <br>
        <span style="text-align: justify; font-size: 10pt;">Подпись: ____________________________</span>
    `);
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const id = 'donwloadVoucherDocs'
    link.id = id
    link.href = blobUrl;
    link.download = `Договор рассрочки №${installment.number}.docx`;
    document.body.appendChild(link);
    document.getElementById(id).click()
};

