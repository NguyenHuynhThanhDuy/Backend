const db = require('../models/index');
const { BadRequest } = require('http-errors');
const { buildPagination } = require('../core/utils/paginantion.utils');
const { where } = require('sequelize');
const { Op } = require("sequelize");
const { BillStatus, OrderStates } = require('../core/constant');
const { sendMail } = require('../core/utils/send-email.utils');

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
    console.log(query);
    const { rows, count } = await db.Bill.findAndCountAll({
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
    if (bill.states === body.states) {
        throw new BadRequest('states already')
    }

    if (body.states === OrderStates.DELIVERED) {
        body.status = BillStatus.PAID;
    }

    await bill.update({ ...body })
    const filter = await getProductInventory(body.states, bill);
    if (filter) {
        const arr = filter.map(detail => ({
            ...detail.dataValues
        }));
        await db.ProductInventory.bulkCreate(
            arr,
            {
                updateOnDuplicate: ["amount", "sold"]
            }
        )
    }
    const billInfo = billInformation(bill);
    const currentStates = statesMessage[body.states];

    if (bill.userId) {
        const user = await db.User.findOne({
            where: { id: bill.userId },
            attribute: ['email']
        })
        sendMail({
            email: user.email,
            subject: "Goldduck Camera - Trạng Thái Đơn Hàng",
            template: 'order-states',
            context: { currentStates, billInfo }
        }).catch(error => console.log(error));
    }
}

async function getProductInventory(states, bill) {
    const productIds = bill.BillDetails.map(detail => detail.productId);

    const productInventory = await db.ProductInventory.findAll({
        where: { inventoryId: 1, productId: { [Op.in]: productIds } }
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

const statesMessage = {
    'accepted': 'Đơn hàng đã được xác nhận',
    'shipping': 'Đơn hàng đã giao cho đơn vị vận chuyển',
    'delivering': 'Đơn hàng đang giao đến bạn',
    'delivered': 'Đơn hàng đã được nhận',
    'cancel': 'Đơn hàng đã bị hủy'
}

function billInformation(bill) {
    return `Địa chỉ nhận hàng: 
    ${bill.customerName}, 
    (+84)${bill.numberPhone.slice(1)}, 
    ${bill.address}.`
}

module.exports = {
    createBill,
    getBills,
    getBill,
    getHistory,
    acceptBill
}