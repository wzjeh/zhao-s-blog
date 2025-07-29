import React, { useState, useEffect } from "react";

type RootEntry = {
  root: string;
  meaning_ja?: string;
  meaning_en?: string;
  meaning_cn?: string;
  examples?: string[];
};

type Props = {
  jsonPath: string;
  lang: "ja" | "en" | "cn";
};

const RootQuiz: React.FC<Props> = ({ jsonPath, lang = "ja" }) => {
  const [data, setData] = useState<RootEntry[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const currentData = data[current];

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setCurrent(Math.floor(Math.random() * json.length));
      });
  }, [jsonPath]);

  useEffect(() => {
    setAnswer("");
    setFeedback("");
  }, [current, lang]);

  const checkAnswer = () => {
    if (!currentData) return;
    const userInput = answer.trim().toLowerCase();
    const correct = currentData.root.toLowerCase();
    const examples = currentData.examples?.join(", ") || "";
    if (userInput === correct) {
      setFeedback(
        `✅ ${
          lang === "ja"
            ? "正解！語根"
            : lang === "en"
            ? "Correct! Root"
            : "正确！词根"
        } "${correct}"、${lang === "ja" ? "例：" : lang === "en" ? "e.g." : "例如："} ${examples}`
      );
      // 答对后延迟 1 秒跳转到下一题
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setFeedback(
        `❌ ${
          lang === "ja"
            ? "不正解、正しい答えは"
            : lang === "en"
            ? "Incorrect. The correct root is"
            : "错误，正确答案是"
        } "${correct}"、${lang === "ja" ? "例：" : lang === "en" ? "e.g." : "例如："} ${examples}`
      );
    }
  };

  const nextQuestion = () => {
    if (data.length <= 1) return;
    let next = current;
    while (next === current) {
      next = Math.floor(Math.random() * data.length);
    }
    setCurrent(next);
  };

  if (!currentData) return <p>Loading...</p>;

  const titleMap = {
    ja: "📘 日本語語根練習",
    en: "📘 English Root Quiz",
    cn: "📘 英语词根记忆练习",
  };

  const meaning =
    lang === "ja"
      ? currentData.meaning_ja || "（意味なし）"
      : lang === "en"
      ? currentData.meaning_en || "(no meaning)"
      : currentData.meaning_cn || "（无含义）";

  const placeholderMap = {
    ja: "語根を入力してください（例：やま）",
    en: "Enter root (e.g. un)",
    cn: "请输入词根（如 un）",
  };

  const submitTextMap = {
    ja: "提出",
    en: "Submit",
    cn: "提交",
  };

  const nextTextMap = {
    ja: "次の問題",
    en: "Next",
    cn: "下一题",
  };

  return (
    <div className="mx-auto max-w-xl bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4" id="title">
        {titleMap[lang]}
      </h2>
      <p className="mb-2" id="question">
        {lang === "ja" ? "意味：" : lang === "en" ? "Meaning: " : "含义："} {meaning}
      </p>
      <input
        id="answer"
        placeholder={placeholderMap[lang]}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkAnswer();
          }
        }}
        className="border p-2 rounded w-3/4 mb-4"
      />
      <div>
        <button
          onClick={checkAnswer}
          className="bg-blue-500 text-white px-4 py-2 m-2 rounded"
        >
          {submitTextMap[lang]}
        </button>
        <button
          onClick={nextQuestion}
          className="bg-green-500 text-white px-4 py-2 m-2 rounded"
        >
          {nextTextMap[lang]}
        </button>
      </div>
      <p
        className="mt-4 text-lg"
        style={{ color: feedback.startsWith("✅") ? "green" : "red" }}
      >
        {feedback}
      </p>
    </div>
  );
};

export default RootQuiz;