// TextGenerator.jsx (기초 실습 - genai 적용 후)
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API 키를 환경 변수에서 가져옵니다. (Vite의 경우 `import.meta.env.VITE_...`)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
}

// GenAI 클라이언트 및 모델 초기화
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("프롬프트를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      // google/genai 라이브러리를 사용하여 텍스트 생성
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setResult(text);
    } catch (err) {
      console.error("Gemini API Error:", err);
      let errorMessage = "텍스트 생성 중 오류가 발생했습니다.";
      if (err.message.includes("API key not valid")) {
        errorMessage =
          "API 키가 유효하지 않습니다. 환경 변수를 다시 확인해주세요.";
      } else if (err.message.includes("429")) {
        errorMessage = "API 요청 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-generator">
      <h4>AI 텍스트 생성기</h4>
      <div className="generator-container">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="생성하고 싶은 텍스트의 프롬프트를 입력하세요..."
          rows={4}
          disabled={isLoading}
        />

        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
          {isLoading ? "생성 중..." : "텍스트 생성"}
        </button>

        {error && (
          <div className="error-box">
            <p className="error">{error}</p>
          </div>
        )}

        {result && (
          <div className="result-box">
            <h5>생성 결과:</h5>
            <pre>{result}</pre>
          </div>
        )}

        <div
          className="info-box"
          style={{ marginTop: "1rem", fontSize: "0.9em" }}
        >
          <p>
            <strong>✨ GenAI 적용 완료!</strong>
            <br />
            이제 실제 생성형 AI가 여러분의 프롬프트를 처리합니다.
            <br />
            API 키가 올바르게 설정되었는지 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
