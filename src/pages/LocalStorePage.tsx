import React, { useEffect, useState } from "react";
import axios from "axios";

interface Store {
  id: number;
  affiliateName: string;   // ✅ 가맹점명
  localBill: string;       // ✅ 사용가능지역화폐
  ctpvName: string;        // ✅ 시도명
  sggName: string;         // ✅ 시군구명
  roadAddr: string;        // ✅ 도로명주소
}

function LocalStorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [ctpv, setCtpv] = useState(""); // 시도명
  const [sgg, setSgg] = useState("");   // 시군구명
  const [searchCtpv, setSearchCtpv] = useState("");
  const [searchSgg, setSearchSgg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/local-store/page`, {
        params: {
          page,
          size: 10,
          ctpv: searchCtpv || undefined,
          sgg: searchSgg || undefined,
        },
      });
      setStores(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, searchCtpv, searchSgg]);

  const handleSearch = () => {
    setPage(0);
    setSearchCtpv(ctpv);
    setSearchSgg(sgg);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>🏬 지역화폐 가맹점 조회</h1>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="시도명 입력 (예: 서울특별시)"
          value={ctpv}
          onChange={(e) => setCtpv(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="시군구명 입력 (예: 강남구)"
          value={sgg}
          onChange={(e) => setSgg(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
        <button onClick={handleSearch} style={{ padding: "0.5rem 1rem" }}>
          검색
        </button>
      </div>

      {loading ? (
        <p>⏳ 로딩 중...</p>
      ) : (
        <div style={{ border: "1px solid #ccc" }}>
          <div style={{ display: "flex", fontWeight: "bold", background: "#f8f8f8" }}>
            <div style={colStyle}>가맹점명</div>
            <div style={colStyle}>사용가능지역화폐</div>
            <div style={colStyle}>시도명</div>
            <div style={colStyle}>시군구명</div>
            <div style={{ ...colStyle, borderRight: "none" }}>소재지도로명주소</div>
          </div>

          {stores.map((store, idx) => (
            <div key={idx} style={{ display: "flex", borderBottom: "1px solid #eee" }}>
              <div style={colStyle}>{store.affiliateName}</div>
              <div style={colStyle}>{store.localBill}</div>
              <div style={colStyle}>{store.ctpvName}</div>
              <div style={colStyle}>{store.sggName}</div>
              <div style={{ ...colStyle, borderRight: "none" }}>{store.roadAddr}</div>
              </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          style={{ marginRight: "0.5rem" }}
        >
          ◀ 이전
        </button>
        <span>{page + 1} / {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={{ marginLeft: "0.5rem" }}
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}

const colStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  borderRight: "1px solid #eee",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default LocalStorePage;