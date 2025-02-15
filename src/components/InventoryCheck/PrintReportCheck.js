import moment from "moment";
const printReport = async (data) => {
  const exportedItem = JSON.parse(JSON.stringify(data?.checkItems));
  const contentPrint = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>inbienbankiemkehang</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <style>
            .bodyPrintPhieuNhapKho * {
                font-family: Times New Roman, Open Sans, sans-serif;
                box-sizing: border-box;
            }

            body {
                background: rgb(204, 204, 204);
                font-size: 14px;
            }

            page {
                background: white;
                display: block;
                margin: 0 auto;
                padding: 10px 20px;
                margin-bottom: 0.5cm;
            }

            table {
                border-collapse: collapse;
                width: 100%;
            }

            td,
            th {
                border: 1px solid #000;
                padding: 8px 0;
            }

            td {
                text-align: center;
            }

            h2 {
                font-size: 1.2em;
                margin-bottom: 5px;
            }

            h3 {
                font-size: 1.1em;
                margin-bottom: 0;
            }

            svg {
                width: 165px !important;
                height: 40px !important;
            }

            .style-th2 {
                width: 130px;
            }

            @media print {
                body,
                page {
                    margin: 0;
                    box-shadow: 0;
                }
            }
        </style>
    </head>
    <body>
        <main class="bodyPrintPhieuNhapKho">
            <page>
                <div style="display: flex; flex-direction: row;">
                    <div style="">
                        <img style="width: 44px; height: 44px; margin-right: 10px;" alt="Sanctum-2.jpg" src="https://tpone.vn/webinfo_files/images/57c57e30-461d-11ed-a701-9b027010aa3d--XMLID_92_.png" />
                    </div>
                    <div style="">
                        <div style="font-weight: bold;">PHÒNG KHÁM ĐA KHOA MỸ THẠNH</div>
                        <div>Tổ 18, Phạm Ngũ Lão, Quận 1, Thành phố Hồ Chí Minh</div>
                        <div>
                            <span>Hotline: 0777 977 177</span>
                        </div>
                    </div>
                </div>
                <div class="title" style="text-align: center; text-transform: uppercase; font-weight: bold; color: #000000; font-size: 14px;">
                    <h2>BIÊN BẢN KIỂM KÊ KHO HÀNG</h2>
                </div>
                <div style="margin-top: 5px; font-size: 12px; text-align: center;"><strong>Mã phiếu:</strong>${
                  data?.checkCode
                }</div>
                <div style="margin-top: 5px; font-size: 12px; text-align: center;">Ngày lập: ${moment(
                  data?.checkedAt,
                ).format("YYYY-MM-DD")}</div>
                <div style="margin-top: 15px;">Xuất tại kho: Kho sản phẩm</div>
                <div style="margin-top: 5px;">Người lập: ${
                  data?.user?.name
                }</div>
                <div style="margin-top: 5px;">Lý do xuất: ${data?.note}</div>
            
                <section style="margin-top: 20px;">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên hàng</th>
                                <th>Số lô hàng</th>
                                <th>Hạn sử dụng</th>
                                <th>Tồn kho</th>
                                <th>Thực kiểm</th>
                                <th>Chênh lệch</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${exportedItem?.map(
                          (item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item?.name}</td>
                            <td>${item?.lotNumber}</td>
                            <td>${moment(item?.expDrug).format(
                              "YYYY-MM-DD",
                            )}</td>
                            <td>${item?.count}</td>
                            <td>${item?.realQty}</td>
                            <td>${item?.unequal}</td>
                        </tr>
                    `,
                        )}
                        </tbody>
                    </table>
                </section>


                <div style="margin-top: 8px;">Ghi chú:</div>

                <div class="footer" style="display: grid; grid-template-columns: 60% 40%; margin-top: 15px; max-width: 100%; page-break-inside: avoid;">
                    <div style="text-align: center; font-weight: 600;">
                        &nbsp;
                    </div>
                    <div style="text-align: center; width: 100%;">
                        An Giang, ngày ${moment().format(
                          "DD",
                        )} tháng ${moment().format("MM")} năm ${moment().format(
                          "YYYY",
                        )}
                        <div style="height: 100px; font-weight: bold; margin-top: 5px">Người lập</div>
                        <div>${data.user?.name}</div>
                    </div>
                </div>
            </page>
        </main>
    </body>
</html>

    `;

  const iframe = document.createElement("iframe");
  const div = document.createElement("div");
  div.id = "printIF";
  iframe.srcdoc = contentPrint;
  iframe.name = "printIF";
  div.appendChild(iframe);
  document.querySelector("body").appendChild(div);
  setTimeout(() => {
    window.frames["printIF"].focus();
    window.frames["printIF"].print();
  }, 500);
  window.frames["printIF"].onafterprint = () =>
    document.querySelector("#printIF").remove();
  return true;
};
export default printReport;
