"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

type Prof = {
  _id: string;
  nom: string;
};

type Rebus = {
  _id: string;
  image: string;
  reponse: string;
  resultats: {
    success: boolean;
    time: number;
  } | null;
};

export default function Dashboard() {
  const router = useRouter();

  const [prof, setProf] = useState<Prof | null>(null);
  const [rebus, setRebus] = useState<Rebus[]>([]);

  // FETCH PROF
  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`/api/profs/${userId}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Erreur API prof");
        }

        return r.json();
      })
      .then((data) => {
        console.log("PROF DATA:", data);
        setProf(data);
      })
      .catch((e) => {
        console.error("FETCH ERROR:", e);
      });
  }, []);

  // FETCH REBUS
  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = localStorage.getItem("userId");

    if (!userId) return;

    fetch(`/api/rebus`,{
        headers:{
            userid: userId || "",
        },
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Erreur API rebus");
        }

        return r.json();
      })
      .then((data) => {
        console.log("REBUS DATA:", data);
        setRebus(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("FETCH ERROR:", e);
      });
  }, []);

  return (
    <main className="main">
      <div className={styles.dashboard}>
        <span className="badge">
          {prof
            ? `Bienvenue M / Mme ${prof.nom} !`
            : "Chargement..."}
        </span>

        <div className={styles.grid}>
          {rebus.map((r) => (
            <div
              key={r._id}
              onClick={
                !r.resultats?.success
                  ? () => router.push(`/rebus/${r._id}`)
                  : undefined
              }
              className={styles["question-card"]}
            >
              {r.resultats?.success ? (
                <div className={styles["question-mark-done"]}>
                  ✔
                </div>
              ) : (
                <div className={styles["question-mark"]}>
                  ?
                </div>
              )}


              <p>
                {r._id.charAt(0).toUpperCase() +
                  r._id.slice(1)}
              </p>
                {r.resultats?.time && (
                <p>
                  ⏱ {r.resultats.time.toFixed(2)}s
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}