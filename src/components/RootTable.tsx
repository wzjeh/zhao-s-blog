import React, { useEffect, useState } from "react";

type RootEntry = {
  root: string;
  meaning_ja?: string;
  meaning_en?: string;
  meaning_cn?: string;  // 可以扩展支持中文
  examples: string[];
};

type RootTableProps = {
  lang: "ja" | "en";
  dataUrl: string;
};

const RootTable = ({ lang, dataUrl }: RootTableProps) => {
  const [data, setData] = useState<RootEntry[]>([]);

  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load data:", err));
  }, [dataUrl]);

  // 动态设置第二列标题和内容字段
  const secondColTitle = lang === "ja" ? "意味（日本語）" : "Meaning (CN)";
  // 英文时显示中文意思字段 meaning_cn，日文时显示 meaning_ja
  const getSecondColValue = (entry: RootEntry) => {
    if (lang === "ja") return entry.meaning_ja || "";
    if (lang === "en") return entry.meaning_cn || "";
    return "";
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">{lang === "ja" ? "語根" : "Root"}</th>
            <th className="border p-2">{secondColTitle}</th>
            <th className="border p-2">{lang === "ja" ? "意味（英語）" : "Meaning (EN)"}</th>
            <th className="border p-2">{lang === "ja" ? "例" : "Examples"}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{entry.root}</td>
              <td className="border p-2">{getSecondColValue(entry)}</td>
              <td className="border p-2">{entry.meaning_en}</td>
              <td className="border p-2">{entry.examples.join("、")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RootTable;
