"use client";

import styles from "./main.module.css";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

type Prof = {
  _id: string;
  nom: string;
};

type ClassementItem = {
  _id: string;
  totalTime: number;
  totalGames: number;
  user: {
    nom: string;
  }
};

export default function Home() {
  const router = useRouter();

  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [profs, setProfs] = useState<Prof[]>([]);
  const [loading, setLoading] = useState(true);

  const [classementOpen, setClassementOpen] = useState(false);
  const [classement, setClassement] = useState<
    ClassementItem[]
  >([]);

  // LOGIN
  const verification = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selected,
          dateNaissance: date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login error:", data);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("userId", selected);
      }

      router.push(`/dashboard/${selected}`);
    } catch (error) {
      console.error("Erreur serveur :", error);
    }
  };

  // CLASSEMENT
  const chargerClassement = async () => {
    try {
      const res = await fetch("/api/classement");

      if (!res.ok) {
        console.error("API error:", res.status);
        return;
      }

      const data = await res.json();

      console.log("CLASSEMENT:", data);

      setClassement(data);
      setClassementOpen(true);
    } catch (error) {
      console.error("Erreur classement :", error);
    }
  };

  // FETCH PROFS
  useEffect(() => {
    fetch("/api/profs")
      .then((r) => {
        if (!r.ok) { throw new Error("Erreur API profs");}
        return r.json();
      })
      .then((data) => {
        console.log("DATA:", data);
        setProfs(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error("FETCH ERROR:", e);
      })
      .finally(() => {  
        setLoading(false);
      });
  }, []);

  return (
    <main className="main">
      <div className={styles.card}>
        <span className="badge">
          Collège Truffaut
        </span>

        <h1>Bienvenue au quizz !</h1>

        <p>
          Devinez les rébus de vos professeurs
          préférés.
        </p>

        <div className={styles["select-wrap"]}>
          <select
            id="prof"
            value={selected}
            onChange={(e) =>
              setSelected(e.target.value)
            }
          >
            <option value="">
              Sélectionner votre nom
            </option>

          {loading ? (
            <option>Chargement...</option>
          ) : (
            profs.map((prof) => (
              <option key={prof._id} value={prof._id}>
                {prof.nom}
              </option>
            ))
          )}
          </select>
        </div>

        <div className={styles.action}>
          <button
            className={styles.btn}
            disabled={!selected}
            onClick={() => setModalIsOpen(true)}
          >
            Commencer le quizz
          </button>

          <button
            className={styles.btnclassement}
            onClick={chargerClassement}
          >
            🏆 Voir le classement
          </button>
        </div>
      </div>

      {/* MODAL LOGIN */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() =>
          setModalIsOpen(false)
        }
        ariaHideApp={false}
        className={styles["modal-content"]}
        overlayClassName={
          styles["modal-overlay"]
        }
      >
        <h2>Vérification</h2>

        <p>Entrez votre date de naissance</p>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className={styles["modal-input"]}
        />

        <div className={styles["modal-actions"]}>
          <button
            className={`${styles.btn} ${styles["btn-cancel"]}`}
            onClick={() => setModalIsOpen(false)}
          >
            Annuler
          </button>

          <button
            className={styles.btn}
            onClick={verification}
          >
            Valider
          </button>
        </div>
      </Modal>

      {/* MODAL CLASSEMENT */}
      <Modal
        isOpen={classementOpen}
        onRequestClose={() =>
          setClassementOpen(false)
        }
        ariaHideApp={false}
        className={styles["modal-content"]}
        overlayClassName={
          styles["modal-overlay"]
        }
      >
        <h2>🏆 Classement</h2>

        <table
          className={styles["classement-table"]}
        >
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom</th>
              <th>Score total</th>
              <th>Parties jouées</th>
            </tr>
          </thead>

          <tbody>
            {classement.map((j, index) => (
              <tr key={j._id}>
                <td>{index + 1}</td>
                <td>{j.user?.nom}</td>
                <td>{j.totalTime.toFixed(2)}s</td>
                <td>{j.totalGames}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className={`${styles.btn} ${styles["btn-cancel"]}`}
          onClick={() =>
            setClassementOpen(false)
          }
        >
          Fermer
        </button>
      </Modal>
    </main>
  );
}