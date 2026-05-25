export const exportToCSV = (data, filename) => {
  // 1. Tạo Header cho file CSV
  const headers = [
    "Mã Giao Dịch",
    "Ngày",
    "Thời Gian",
    "Loại",
    "Số Tiền",
    "Thanh Toán",
    "Trạng Thái",
  ];

  // 2. Map dữ liệu thành các dòng (rows)
  const rows = data.map((tx) => [
    tx.id,
    tx.date,
    tx.time,
    tx.type,
    tx.amount,
    tx.method,
    tx.status,
  ]);

  // 3. Ghép Header và Rows lại, ngăn cách bằng dấu phẩy
  const csvArray = [headers, ...rows];
  const csvString = csvArray.map((e) => e.join(",")).join("\n");

  // 4. Thêm BOM (\uFEFF) để Excel không bị lỗi font tiếng Việt
  const blob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  // 5. Kích hoạt trình duyệt tải file về
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
