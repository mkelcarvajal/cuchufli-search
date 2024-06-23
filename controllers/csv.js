const { request, response } = require('express');
const { Spot } = require('@binance/connector')
const dayjs = require('dayjs');
const path = require('path');
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

async function saveCsvCompra(req, res) {
    const apiKey = req.headers.apikey
    const apiSecret = req.headers.secretkey
    const client = new Spot(apiKey, apiSecret)
    let sellArrayAux = [];
    // console.log(dayjs(`${req.body.date}T23:59:59+03:00`).valueOf());
    // return;
    // return;

    for (let i = Number(req.body.pages); i > 0; i--) {
        const sells = await client.c2cTradeHistory("BUY", {
            startTimestamp: dayjs(req.body.date).valueOf(),
            endTimestamp: dayjs(`${req.body.date}T23:59:59-04:00`).valueOf(),
            page: i,
            rows: 100
        })
        sellArrayAux = sellArrayAux.concat(sells.data.data)
    }
    const sellArray = [];
    const comprasArray = [];
    let amountTotal = 0;
    let totalPrice = 0;

    for (let element of sellArrayAux) {
        if (element.orderStatus === "COMPLETED") {
            comprasArray.push(element.orderNumber)
            const sell = {
                orderNumber: element.orderNumber,
                amount: parseFloat(element.amount),
                totalPrice: parseInt(element.totalPrice.split(".")[0]),
                createTime: dayjs(element.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
            amountTotal = amountTotal + sell.amount;
            totalPrice = totalPrice + sell.totalPrice;
            sellArray.push(sell)
        }
    }

    const sellFinal = {
        orderNumber: "TOTAL",
        amount: parseFloat(amountTotal),
        totalPrice: parseInt(totalPrice),
        createTime: "FIN"
        // dayjs(createTime).now.format('YYYY-MM-DD HH:mm:ss')
    }

    const sortedData = sellArray.sort(sortByCreateTime);
    console.log(sortedData.length);
    sellArray.push(sellFinal);
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'compras.csv')
    await convertJSONToCSV(sortedData, filePath)
    res.status(200).sendFile(filePath);

}


async function saveCsvVentas(req, res) {
    const apiKey = req.headers.apikey
    const apiSecret = req.headers.secretkey
    const client = new Spot(apiKey, apiSecret)
    let sellArrayAux = [];
    for (let i = Number(req.body.pages); i > 0; i--) {
        const sells = await client.c2cTradeHistory("SELL", {
            startTimestamp: dayjs(req.body.date).valueOf(),
            endTimestamp: dayjs(`${req.body.date}T23:59:59-04:00`).valueOf(),
            page: i,
            rows: 100
        })
        sellArrayAux = sellArrayAux.concat(sells.data.data)
    }
    const sellArray = [];
    const comprasArray = [];
    let amountTotal = 0;
    let totalPrice = 0;

    for (let element of sellArrayAux) {
        if (element.orderStatus === "COMPLETED") {
            comprasArray.push(element.orderNumber)
            const sell = {
                orderNumber: element.orderNumber,
                amount: parseFloat(element.amount),
                totalPrice: parseInt(element.totalPrice.split(".")[0]),
                createTime: dayjs(element.createTime).format('YYYY-MM-DD HH:mm:ss')

                // dayjs(createTime).now.format('YYYY-MM-DD HH:mm:ss')
            }
            amountTotal = amountTotal + sell.amount;
            totalPrice = totalPrice + sell.totalPrice;
            sellArray.push(sell)
        }
    }

    const sellFinal = {
        orderNumber: "TOTAL",
        amount: parseFloat(amountTotal),
        totalPrice: parseInt(totalPrice),
        createTime: "FIN"
        // dayjs(createTime).now.format('YYYY-MM-DD HH:mm:ss')
    }

    const sortedData = sellArray.sort(sortByCreateTime);
    console.log(sortedData.length);
    sellArray.push(sellFinal);
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'ventas.csv')
    await convertJSONToCSV(sortedData, filePath)
    res.status(200).sendFile(filePath);

}

async function compareBuyTRX(req, res) {

    const apiKey = req.headers.apikey
    const apiSecret = req.headers.secretkey
    const client = new Spot(apiKey, apiSecret)
    let sellArrayAux = [];
    for (let i = Number(req.body.pages); i > 0; i--) {
        const sells = await client.c2cTradeHistory("BUY", {
            startTimestamp: dayjs(req.body.date).valueOf(),
            endTimestamp: dayjs(`${req.body.date}T23:59:59-04:00`).valueOf(),
            page: i,
            rows: 100
        })
        sellArrayAux = sellArrayAux.concat(sells.data.data)
    }
    const comprasArray = [];

    for (let element of sellArrayAux) {
        if (element.orderStatus === "COMPLETED") {
            comprasArray.push(element.orderNumber)
        }
    }

    const uniqueElements = encontrarUnicos(comprasArray, req.body.compras);
    for (let raros of uniqueElements) {
        console.log(sellArrayAux.find(element => element.orderNumber === raros))
    }

    console.log(uniqueElements); // Output: [1, 2, 6, 7]
    res.status(200).send(uniqueElements);

}

async function compareSellTRX(req, res) {

    const apiKey = req.headers.apikey
    const apiSecret = req.headers.secretkey
    const client = new Spot(apiKey, apiSecret)
    let sellArrayAux = [];
    for (let i = Number(req.body.pages); i > 0; i--) {
        const sells = await client.c2cTradeHistory("SELL", {
            startTimestamp: dayjs(req.body.date).valueOf(),
            endTimestamp: dayjs(`${req.body.date}T23:59:59-04:00`).valueOf(),
            page: i,
            rows: 100
        })
        sellArrayAux = sellArrayAux.concat(sells.data.data)
    }
    const comprasArray = [];

    for (let element of sellArrayAux) {
        if (element.orderStatus === "COMPLETED") {
            comprasArray.push(element.orderNumber)
        }
    }

    // console.log(sellArray);
    const uniqueElements = encontrarUnicos(comprasArray, req.body.ventas);
    for (let raros of uniqueElements) {
        console.log(sellArrayAux.find(element => element.orderNumber === raros))
    }
    console.log(uniqueElements); // Output: [1, 2, 6, 7]
    res.status(200).send(uniqueElements);

}

async function compareDuplicateTRX(req, res) {
    const duplicados = encontrarDuplicados(req.body.ventas);
    res.status(200).send(duplicados);
}

function encontrarDuplicados(array) {
    const conjunto = new Set();
    const duplicados = [];

    for (const elemento of array) {
        if (conjunto.has(elemento)) {
            duplicados.push(elemento);
        } else {
            conjunto.add(elemento);
        }
    }

    return duplicados;
}

function encontrarUnicos(array1, array2) {
    const unicos = [];

    // Recorrer el primer array
    array1.forEach(elemento => {
        // Si el elemento no está en el segundo array ni en el array de únicos, agregarlo
        if (!array2.includes(elemento) && !unicos.includes(elemento)) {
            unicos.push(elemento);
        }
    });

    // Recorrer el segundo array
    array2.forEach(elemento => {
        // Si el elemento no está en el primer array ni en el array de únicos, agregarlo
        if (!array1.includes(elemento) && !unicos.includes(elemento)) {
            unicos.push(elemento);
        }
    });

    return unicos;
}

function sortByCreateTime(a, b) {
    const dateA = new Date(a.createTime);
    const dateB = new Date(b.createTime);
    return dateA - dateB; // Earlier dates come first
}

async function convertJSONToCSV(jsonData, fileName) {
    // Create CSV headers from JSON object keys
    const csvHeaders = Object.keys(jsonData[0]).join(',');

    // Create CSV content as string
    let csvContent = '';
    for (const data of jsonData) {
        const row = Object.values(data).join(',');
        csvContent += `${row}\n`;
    }

    // Write CSV content to file
    await writeFile(fileName, csvHeaders + '\n' + csvContent);
}

// Function to write file using promises
async function writeFile(fileName, fileContent) {
    return new Promise((resolve, reject) => {
        const fs = require('fs');
        fs.writeFile(fileName, fileContent, (err) => {
            if (err) reject(err);
            else resolve('File written successfully');
        });
    });
}


async function getBuyTRX(req, res) {
    const apiKey = req.headers.apikey
    const apiSecret = req.headers.secretkey
    const client = new Spot(apiKey, apiSecret)
    let sellArrayAux = [];
    let elementFind = {};
    console.log("hola");
    for (let i = 1; i < Number(req.body.pages); i++) {
        const sells = await client.c2cTradeHistory("BUY", {
            startTimestamp: dayjs(req.body.date).valueOf(),
            endTimestamp: dayjs(`${req.body.date}T23:59:59-04:00`).valueOf(),
            page: i,
            rows: 100
        })

        if (sells.data.data.length === 0) {
            break;
        }

        console.log(sells.data.data);
        elementFind = sells.data.data.find(element => element.orderNumber === req.body.orderNumber)
        if (elementFind) {
            console.log("element find is:");
            console.log(elementFind)
            elementFind.amount = parseFloat(elementFind.amount).toFixed(2);
            elementFind.totalPrice = elementFind.totalPrice.split(".")[0];
            break;
        }
    }

    res.status(200).send(elementFind);

}


module.exports = {
    saveCsvCompra,
    saveCsvVentas,
    compareBuyTRX,
    compareSellTRX,
    compareDuplicateTRX,
    getBuyTRX
}
