import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import * as XLSX from "xlsx";


function App() {
  const [items, setItems] = useState([]);
  const [smsText, setSmsText] = useState("");
  // const [exportedData, setExportedData] = useState(false);
  const [eventTriggered, setEventTriggered] = useState(false);

  useEffect(() => {
    console.log(items);
    fetchDataFromMongoDB();
    // Hàm này được gọi mỗi khi eventTriggered thay đổi
    if (eventTriggered) {
      // Tải lại trang khi eventTriggered được kích hoạt
      window.location.reload();
    }
  }, [eventTriggered]);

  const fetchDataFromMongoDB = async () => {
    try {
      const response = await axios.get(
        "http://tuyendung.vietlonghung.com.vn:30002/api/admin/users"
      );
      setItems(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày Sinh</th>
            <th>Giới tính</th>
            <th>Căn cước công nhân</th>
            <th>Trình độ học vấn</th>
            <th>Vị trí ứng tuyển</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0).map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.fullname}</td>
              <td>{item.email}</td>
              <td>{item.numberPhone}</td>
              <td>{item.date}</td>
              <td>{item.gender}</td>
              <td>{item.cccd}</td>
              <td>{item.tdhv}</td>
              <td>{item.vtut}</td>
              <textarea
                id={item._id}
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                required
              />
              <br />
              <button
                value={item.numberPhone}
                onClick={() => handleSendSMS(item.numberPhone)}
              >
                Gửi SMS
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // const exportToExcel = (e) => {
  //   // console.log(items);
  //   // const wb = XLSX.utils.book_new();
  //   // const header = [];
  //   // const ws = XLSX.utils.aoa_to_sheet([[header]]);
  //   // XLSX.utils.sheet_add_json(ws, items, { header });
  //   // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //   // XLSX.writeFile(wb, "mongodb_data.xlsx");
  //   e.preventDefault();
  //   console.log(items);

  //   const apiURL =
  //     "https://sheet.best/api/sheets/b096ee2b-3a83-41ac-bb22-8e3a6459656d";

  //   // Lấy dữ liệu hiện có từ API
  //   axios
  //     .get(apiURL)
  //     .then((response) => {
  //       const existingData = response.data;

  //       // Gửi dữ liệu mới nếu không bị trùng lặp
  //       axios
  //         .post(apiURL, items)
  //         .then((postResponse) => {
  //           console.log("Response:", postResponse);
  //           alert("Dữ liệu đã được gửi thành công!");
  //         })
  //         .catch((postError) => {
  //           console.error("Có lỗi xảy ra khi gửi dữ liệu!", postError);
  //           alert("Có lỗi xảy ra khi gửi dữ liệu.");
  //         });
  //     })
  //     .catch((getError) => {
  //       console.error("Có lỗi xảy ra khi lấy dữ liệu hiện có!", getError);
  //       alert("Có lỗi xảy ra khi kiểm tra dữ liệu hiện có.");
  //     });
  // };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        "http://tuyendung.vietlonghung.com.vn:30002/export"
      );
      console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data");
    }
  };

  const handleDeleteAll = async () => {
    const confirmation = window.confirm(
      "Bạn có chắc chắn muốn xóa tất cả dữ liệu không?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          "http://tuyendung.vietlonghung.com.vn:30002/api/delete-all"
        );
        alert(response.data.message);
        fetchDataFromMongoDB(); // Fetch data lại sau khi xóa
      } catch (error) {
        // setError("Lỗi khi xóa dữ liệu");
        console.error("Lỗi khi xóa dữ liệu:", error);
        alert("Lỗi khi xóa dữ liệu");
      }
    }
  };

  const deleteData = (id) => {
    console.log(id);
    try {
      axios.delete(`http://tuyendung.vietlonghung.com.vn:30002/api/data/${id}`);
      // return;
      console.log("Data deleted successfully");
      setEventTriggered(true);
      alert("Xóa Thành công");
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleSendSMS = (numberPhone) => {
    // Gửi yêu cầu gửi tin nhắn tới backend
    axios
      .post("http://localhost:5000/api/admin/sendSMS", {
        numberPhone,
        smsText,
      })
      .then((response) => {
        console.log(` sdt nhận: ${numberPhone}`);
        console.log(response.data);
        setSmsText();
        alert("Tin nhắn đã được gửi!");
      })
      .catch((error) => {
        console.error("Đã có lỗi xảy ra khi gửi tin nhắn:", error);
        alert("Đã có lỗi xảy ra khi gửi tin nhắn!");
      });
  };

  return (
    <div className="container">
      <h1>Danh sách người dùng</h1>
      {/* <button onClick={exportToExcel}>Export to Excel</button> */}
      <div className="dislay-btn">
        <button class="print-btn" onClick={handleExport}>
          <span class="printer-wrapper">
            <span class="printer-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 92 75"
              >
                <path
                  stroke-width="5"
                  stroke="black"
                  d="M12 37.5H80C85.2467 37.5 89.5 41.7533 89.5 47V69C89.5 70.933 87.933 72.5 86 72.5H6C4.067 72.5 2.5 70.933 2.5 69V47C2.5 41.7533 6.75329 37.5 12 37.5Z"
                ></path>
                <mask fill="white" id="path-2-inside-1_30_7">
                  <path d="M12 12C12 5.37258 17.3726 0 24 0H57C70.2548 0 81 10.7452 81 24V29H12V12Z"></path>
                </mask>
                <path
                  mask="url(#path-2-inside-1_30_7)"
                  fill="black"
                  d="M7 12C7 2.61116 14.6112 -5 24 -5H57C73.0163 -5 86 7.98374 86 24H76C76 13.5066 67.4934 5 57 5H24C20.134 5 17 8.13401 17 12H7ZM81 29H12H81ZM7 29V12C7 2.61116 14.6112 -5 24 -5V5C20.134 5 17 8.13401 17 12V29H7ZM57 -5C73.0163 -5 86 7.98374 86 24V29H76V24C76 13.5066 67.4934 5 57 5V-5Z"
                ></path>
                <circle fill="black" r="3" cy="49" cx="78"></circle>
              </svg>
            </span>

            <span class="printer-page-wrapper">
              <span class="printer-page"></span>
            </span>
          </span>
          Export to Excel
        </button>
        <button onClick={handleDeleteAll} class="noselect">
          <span class="text">Delete All</span>
          <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
            </svg>
          </span>
        </button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h2>Họ và tên: {item.fullname}</h2>
            <p>Email: {item.email}</p>
            <p>Số Điện thoại:{item.numberPhone}</p>
            <p>Ngày sinh:{item.date}</p>
            <p>Giới tính: {item.gender}</p>
            <p>Căn cước công dân: {item.cccd}</p>
            <p>Vị trí ứng tuyển: {item.vtut}</p>
            <p>{item.henPV}</p>
            <p>Ảnh căn cước công dân mặt trước:</p>
            <img
              className="image"
              src={item.imageUrl1}
              alt={`CCCD mặt trước ${item.fullname}`}
            />
            <p>Ảnh căn cước công dân mặt sau:</p>
            <img
              className="image"
              src={item.imageUrl2}
              alt={`CCCD mặt sau ${item.fullname}`}
            />
            {/* <p>Nội dung SMS</p>
            <textarea
              id={item._id}
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              required
            />
            <br />
            <button
              value={item.numberPhone}
              onClick={() => handleSendSMS(item.numberPhone)}
            >
              Gửi SMS
            </button> */}
            {/* <img src={item.image} alt={item.fullname} /> */}
            <br />
            <button class="bin-button" onClick={() => deleteData(item._id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 39 7"
                class="bin-top"
              >
                <line
                  stroke-width="4"
                  stroke="white"
                  y2="5"
                  x2="39"
                  y1="5"
                ></line>
                <line
                  stroke-width="3"
                  stroke="white"
                  y2="1.5"
                  x2="26.0357"
                  y1="1.5"
                  x1="12"
                ></line>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 33 39"
                class="bin-bottom"
              >
                <mask fill="white" id="path-1-inside-1_8_19">
                  <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
                </mask>
                <path
                  mask="url(#path-1-inside-1_8_19)"
                  fill="white"
                  d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
                ></path>
                <path stroke-width="4" stroke="white" d="M12 6L12 29"></path>
                <path stroke-width="4" stroke="white" d="M21 6V29"></path>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 89 80"
                class="garbage"
              >
                <path
                  fill="white"
                  d="M20.5 10.5L37.5 15.5L42.5 11.5L51.5 12.5L68.75 0L72 11.5L79.5 12.5H88.5L87 22L68.75 31.5L75.5066 25L86 26L87 35.5L77.5 48L70.5 49.5L80 50L77.5 71.5L63.5 58.5L53.5 68.5L65.5 70.5L45.5 73L35.5 79.5L28 67L16 63L12 51.5L0 48L16 25L22.5 17L20.5 10.5Z"
                ></path>
              </svg>
            </button>

            {/* <button onClick={() => deleteData(item._id)}>Xóa</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
