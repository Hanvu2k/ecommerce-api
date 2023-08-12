const { formatNumber } = require("./formartNumber");
const nodemailer = require("nodemailer");

module.exports.mailOptions = (orderDetail) => {
  return {
    from: "vungochan.dtvt@gmail.com",
    to: orderDetail.email,
    subject: `Your order has been created`,
    html: `<div>
            <h1>Xin Chào ${orderDetail.name}</h1>
            <div style="font-size:16px">Phone: 0${orderDetail.phoneNumber}</div>
            <div style="font-size:16px">Address: ${orderDetail.address}</div>
            <h2>Order Details:</h2>
            <table style="border-collapse: collapse">
              <thead>
                <tr style="text-align:center">
                  <th style="padding:4px 8px; border: 1px solid #ddd;">
                    Tên sản phẩm
                  </th>
                  <th style="padding:4px 8px; border: 1px solid #ddd;">
                    Hình ảnh
                  </th>
                  <th style="padding:4px 8px; border: 1px solid #ddd;">Giá</th>
                  <th style="padding:4px 8px; border: 1px solid #ddd;">
                    Số lượng
                  </th>
                  <th style="padding:4px 8px; border: 1px solid #ddd;">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                ${orderDetail.products
                  .map(
                    (product) =>
                      `<tr style="text-align:center">
                      <td style="padding:4px 8px; border: 1px solid #ddd;">
                        ${product.product_id.name}
                      </td>
                      <td style="padding:4px 8px; border: 1px solid #ddd;">
                        <img
                          src=${product.product_id.photos[0]}
                          alt="${product.product_id.name}"
                          width="50"
                        />
                      </td>
                      <td style="padding:4px 8px; border: 1px solid #ddd;">
                        ${formatNumber(product.product_id.price)} VND
                      </td>
                      <td style="padding:4px 8px; border: 1px solid #ddd;">
                        ${product.quantity}
                      </td>
                      <td style="padding:4px 8px; border: 1px solid #ddd;">
                        ${formatNumber(
                          product.product_id.price * product.quantity
                        )} VND
                      </td>
                    </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
            <h2 style="margin:0">Tổng thanh toán:</h2>
            <div style="font-size:19px;margin-bottom:12px">
              ${formatNumber(orderDetail.total)} VND
            </div>
            <div style="font-size:19px">Cảm ơn bạn!</div>
          </div>`,
  };
};

module.exports.transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "vungochan.dtvt@gmail.com",
    pass: "qalzhuhpgpmdhgge",
  },
});
