"use client";

import styles from "./page.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Rebus = {
  _id: string;
  image: string;
  reponse: string;
};

export default function RebusPage() {
  const router = useRouter();
  const [rebus, setRebus] = useState<Rebus | null>(null);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const params = useParams();
  const id = params?.id as string;

  // FETCH REBUS
  useEffect(() => {
    if (!id) return;

    fetch(`/api/rebus/${id}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Erreur API");
        }

        return r.json();
      })
      .then((data) => {
        setRebus(data);

        // reset timer
        setStartTime(Date.now());
        setElapsedTime(0);
        setIsFinished(false);
        setResult(null);
        setAnswer("");
      })
      .catch((e) => {
        console.error("Erreur fetch rebus:", e);
      });
  }, [id]);

  // TIMER
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  // SUBMIT
  const handleSubmit = async () => {
    if (!rebus || !startTime || isFinished) return;

    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("userId")
        : null;

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
      setIsFinished(true);

      // 🚀 ENVOI UNIQUEMENT SI BONNE RÉPONSE
      try {
        await fetch("/api/rebus-resultat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            rebusId: rebus._id,
            time: timeSpent,
            success: true,
          }),
        });

        router.push("/dashboard/" + userId);

      } catch (error) {
        console.error("Erreur enregistrement résultat:", error);
      }
    }
  };

  return (
    <main className="main">
      {rebus ? (
        <div className={styles["rebus-container"]}>
          <img
            src={rebus.image}
            alt="Rebus"
            className={styles["rebus-image"]}
          />

          <p className={styles.timer}>
            ⏱ {elapsedTime.toFixed(3)} s
          </p>

          <div className={styles["answer-box"]}>
            <input
              type="text"
              value={answer}
              autoFocus
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Ta réponse..."
              className={styles["answer-input"]}
              disabled={isFinished}
            />

            <button
              onClick={handleSubmit}
              className={styles["answer-button"]}
              disabled={isFinished}
            >
              Répondre
            </button>

            {result && (
              <p className={styles.result}>
                {result}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          Chargement...
        </div>
      )}
    </main>
  );
}