"use client";

import "./page.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Rebus = {
  _id: string;
  image: string;
  reponse: string;
};

export default function RebusPage() {
  const [rebus, setRebus] = useState<Rebus | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { id } = useParams();

  // 🔥 Fetch rebus + reset timer
  useEffect(() => {
    if (!id) return;

    fetch(`/api/rebus/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Erreur API");
        return r.json();
      })
      .then((data) => {
        setRebus(data);

        // ⏱ reset timer
        setStartTime(Date.now());
        setElapsedTime(0);
        setIsFinished(false);
        setResult(null);
        setAnswer("");
      })
      .catch((e) => {
        console.error(e);
      });
  }, [id]);

  // ⏱ TIMER LIVE
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!rebus || !startTime) return;
    if (isFinished) return;

    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = rebus.reponse.trim().toLowerCase();

    const isSuccess = userAnswer === correctAnswer;

    const timeSpent = (Date.now() - startTime) / 1000;

    setResult(
      isSuccess
        ? "✅ Bonne réponse !"
        : "❌ Mauvaise réponse, essaie encore !"
    );

    if (isSuccess) {
      setIsFinished(true); // ⛔ stop timer
    }

    try {
      await fetch("/api/rebus-resultat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          rebusId: rebus._id,
          time: timeSpent,
          success: isSuccess,
        }),
      });
    } catch (error) {
      console.error("Erreur enregistrement résultat:", error);
    }
  };

  return (
    <main className="main">
      {rebus ? (
        <div className="rebus-container">
          <img src={rebus.image} alt="Rebus" className="rebus-image" />

          {/* ⏱ TIMER LIVE */}
          <p className="timer">
            ⏱ {elapsedTime.toFixed(3)} s
          </p>

          <div className="answer-box">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ta réponse..."
              className="answer-input"
              disabled={isFinished}
            />

            <button
              onClick={handleSubmit}
              className="answer-button"
              disabled={isFinished}
            >
              Répondre
            </button>

            {result && <p className="result">{result}</p>}
          </div>
        </div>
      ) : (
        <div className="loading">Chargement...</div>
      )}
    </main>
  );
}