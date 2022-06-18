import EscPosEncoder from 'esc-pos-encoder'

export const connectPrinterByBluetooth = async () => {
    let device = await navigator.bluetooth.requestDevice({filters: [{services: ['000018f0-0000-1000-8000-00805f9b34fb']}]})
    let server = await device.gatt.connect();
    let service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
    return await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')
}

export const printEsPosData = async (printer, data) => {
    let encoder = new EscPosEncoder();
    let printMessage, printQR, printImg
    for(let i=0; i<data.length; i++) {
        if(data[i].message) {
            data[i].message = encoder.codepage('cp866').align(data[i].align).bold(data[i].bold).line(data[i].message).bold(false).encode();
            while (data[i].message.length > 20) {
                printMessage = data[i].message.slice(0, 20);
                await printer.writeValue(printMessage);
                data[i].message = data[i].message.slice(20);
            }
            if(data[i].message.length)
                await printer.writeValue(data[i].message);
        }
        else if(data[i].QR) {
            data[i].QR = encoder.align('center').qrcode(data[i].QR, 1, 4, 'h').encode();
            while (data[i].QR.length > 20) {
                printQR = data[i].QR.slice(0, 20);
                await printer.writeValue(printQR);
                data[i].QR = data[i].QR.slice(20);
            }
            if(data[i].QR.length)
                await printer.writeValue(data[i].QR);
        }
        else if(data[i].image) {
            let img = new Image();
            img.src = data[i].image;
            await img.decode();
            img = encoder
                .align('center')
                .image(img, 240, 240, 'atkinson')
                .encode()
            while (img.length > 20) {
                printImg = img.slice(0, 20);
                await printer.writeValue(printImg);
                img = img.slice(20);
            }
            if(img.length)
                await printer.writeValue(img);
        }
    }
    await printer.writeValue(encoder.text('\u000A\u000A\u000D').encode());
}

export const printEsPosQR = async (printer, QR) => {
    let encoder = new EscPosEncoder();
    let printQR
    QR = encoder
        .align('center')
        .qrcode(QR, 1, 6, 'h')
        .encode();
    while (QR.length > 20) {
        printQR = QR.slice(0, 20);
        await printer.writeValue(printQR);
        QR = QR.slice(20);
    }
    await printer.writeValue(QR);
    await printer.writeValue(encoder.text('\u000A\u000A\u000D').encode());
}

export const printEsPosImg = async (printer, srcImg) => {
    let encoder = new EscPosEncoder();
    let printImg;
    let img = new Image();
    img.src = srcImg;
    await img.decode();
    img = encoder
        .image(img, 320, 320, 'atkinson')
        .encode()
    while (img.length > 20) {
        printImg = img.slice(0, 20);
        await printer.writeValue(printImg);
        img = img.slice(20);
    }
    await printer.writeValue(img);
    await printer.writeValue(encoder.text('\u000A\u000A\u000D').encode());
}