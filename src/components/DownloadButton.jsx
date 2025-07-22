import { useState } from "react";

export default function DownloadButton({ gb_f_name, gb_old_f_name }) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!gb_f_name) return;
        try {
            setLoading(true);
            const fileUrl = `http://nohssam.store:8080/api/guestbook/fileDownload?gb_f_name=${encodeURIComponent(gb_f_name)}`;
            const res = await fetch(fileUrl);
            const result = await res.json();
            if (result.success) {
                   console.log(result)
                // 직접 열기 : window.location.href = result.data;
                // 새로운 탭에 열기
                 window.open(result.data, "_blank");  
            } else {
                alert("다운로드 링크 생성 실패: " + result.message);
            }
        } catch (err) {
            console.error(err);
            alert("다운로드 중 오류 발생");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            className="file-down"
            onClick={handleDownload}
            disabled={loading}
        >
            {loading ? "다운로드 중..." : gb_old_f_name || "파일 다운로드"}
        </button>
    );
}