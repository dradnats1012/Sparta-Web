import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { FixedSizeList as List } from "react-window";

interface LoanRecord {
  id: number;
  schoolName: string;
  grade: number;
  bookTitle: string;
  loanDate: string;
}

function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [loanRecords, setLoanRecords] = useState<LoanRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLoanRecords = async () => {
    if (!startDate || !endDate) {
      alert("날짜를 선택하세요");
      return;
    }

    const start = dayjs(startDate).format("YYYY-MM-DD");
    const end = dayjs(endDate).format("YYYY-MM-DD");

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/loanRaw`,
        {
          params: {
            startDate: start,
            endDate: end,
          },
        }
      );

      setLoanRecords(response.data);
    } catch (err) {
      setError("조회 실패!");
    } finally {
      setLoading(false);
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const record = loanRecords[index];
    return (
      <tr style={{ ...style, display: "table", width: "100%", tableLayout: "fixed" }}>
        <td style={tdStyle}>{record.schoolName}</td>
        <td style={tdStyle}>{record.grade}학년</td>
        <td style={tdStyle}>{record.bookTitle}</td>
        <td style={tdStyle}>{record.loanDate}</td>
      </tr>
    );
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>📚 대출 내역 조회</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <label>
          시작일:{" "}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="시작 날짜"
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <label>
          종료일:{" "}
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="종료 날짜"
            dateFormat="yyyy-MM-dd"
          />
        </label>
        <button
          onClick={fetchLoanRecords}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          조회
        </button>
      </div>

      {loading && <p>⏳ 조회 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ border: "1px solid #ccc", maxHeight: "600px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
              <th style={thStyle}>학교</th>
              <th style={thStyle}>학년</th>
              <th style={thStyle}>도서명</th>
              <th style={thStyle}>대출일</th>
            </tr>
          </thead>
          <tbody>
            <List
              height={500}
              itemCount={loanRecords.length}
              itemSize={50}
              width="100%"
              outerElementType="tbody"
            >
              {Row}
            </List>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid #ccc",
  padding: "8px",
  backgroundColor: "#f8f8f8",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

export default App;