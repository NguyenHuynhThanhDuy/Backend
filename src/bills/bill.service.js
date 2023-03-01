const db = require('../models/index');
const { BadRequest } = require('http-errors');
const { buildPagination } = require('../core/utils/paginantion.utils');
const { where } = require('sequelize');
const { Op } = require("sequelize");
const { BillStatus, OrderStates } = require('../core/constant');

async function createBill({ details, ...body }) {
    const bill = await db.Bill.create(body);
    if (!bill) {
        throw new BadRequest("can't create bill");
    }

    const detailsCom = details.map(detail => ({
        ...detail,
        billId: bill.id,
    }));
    const billDetails = await db.BillDetail.bulkCreate(detailsCom);
    return { bill, billDetails };
}

async function getBills(req) {
    const query = buildPagination(req);
    const { rows, count } = await db.Bill.findAndCountAll({
        ...query,
        include: db.BillDetail
    })
    return { totalPage: Math.ceil(count / req.limit), bill: rows };
}

async function getBill(id) {
    const bill = await db.Bill.findOne({
        where: { id: id },
        include: db.BillDetail
    })
    if (!bill) {
        throw new BadRequest('Bill not found')
    }
    return bill;
}

async function getHistory(req) {
    const query = buildPagination(req);
    const { rows, count } = db.Bill.findAndCountAll({
        ...query,
        include: db.BillDetail
    })
    return { totalPage: Math.ceil(count / req.limit), bill: rows };
}

async function acceptBill(id, body) {
    const bill = await db.Bill.findOne({
        where: { id: id },
        include: db.BillDetail
    })
    if (!bill) {
        throw new BadRequest('Bill not found')
    }
    await bill.update({ ...body })
    const filter = await getProductInventory(body.states, bill);
    const arr = filter.map(detail => ({
        ...detail.dataValues
    }));
    if (filter) {
        await db.ProductInventory.bulkCreate(
            arr,
            {
                updateOnDuplicate: ["amount", "sold"]
            }
        );
        // return neww;
    }

    return arr;
}

async function getProductInventory(states, bill) {
    const productIds = bill.BillDetails.map(detail => detail.productId);

    const productInventory = await db.ProductInventory.findAll({
        where: { inventoryId: 1, productId: { [Op.in]: productIds } },
        attributes: ['id', 'sold', 'amount', 'productId', 'inventoryId']
    })

    if (states === OrderStates.SHIPPING) {
        productInventory.forEach(productInventory => {
            bill.BillDetails.forEach(BillDetail => {
                if (productInventory.productId === BillDetail.productId) {
                    productInventory.sold += BillDetail.count;
                    productInventory.amount -= BillDetail.count;
                }
            })
        });
        return productInventory;
    }
    if (states === OrderStates.CANCEL && bill.states != OrderStates.WAITING && bill.states != OrderStates.ACCEPTED) {
        productInventory.forEach(productInventory => {
            bill.BillDetails.forEach(BillDetail => {
                if (productInventory.productId === billDetails.productId) {
                    productInventory.sold -= BillDetail.count;
                    productInventory.amount += BillDetail.count;
                }
            })
        });
        return productInventory;
    }
    return null;
}

module.exports = {
    createBill,
    getBills,
    getBill,
    getHistory,
    acceptBill,
    getProductInventory
}