"use client";
import "./main.css";
import { useState, useEffect } from "react";
import Modal from 'react-modal'
import { useRouter } from "next/navigation";




type Prof = { _id: string; nom: string };

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [profs, setProfs] = useState<Prof[]>([]);

  const [classementOpen, setClassementOpen] = useState(false);
const [classement, setClassement] = useState<any[]>([]);

  const verification = async() => {
    try {
      const response = await fetch('/api/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          userId: selected,
          dateNaissance: date,
        }),
      })
      const data = await response.json();
      if (!response.ok){
        console.error('Login error:', data)
        return;
      }
      localStorage.setItem("userId", selected);
      router.push(`/dashboard/${selected}`)   

      
    } catch (error) {
          console.error("Erreur serveur :", error);
    }

  }
const chargerClassement = async () => {
  try {
    const res = await fetch("/api/classement");

    if (!res.ok) {
      console.error("API error:", res.status);
      return;
    }

    const data = await res.json();
    console.log('classemnet ',data)

    setClassement(data);
    setClassementOpen(true);

  } catch (error) {
    console.error("Erreur classement :", error);
  }
};

useEffect(() => {
  fetch("/api/profs")
    .then((r) => r.json())
    .then((data) => {
      console.log("DATA:", data);
      setProfs(Array.isArray(data) ? data : []);
    })
    .catch((e) => {
      console.error("FETCH ERROR:", e);
    });
}, []);

  return (
    <main className="main">
      <div className="card">
        <span className="badge">Collège Truffaut</span>
        <h1>Bienvenue au quizz !</h1>
        <p>Devinez les rébus de vos professeurs préférés.</p>
        <div className="select-wrap">
          <select
            id="prof"
            value={selected}
            onChange={(e) => {setSelected(e.target.value) ; console.log(e.target.value)}}
          >
            <option value="">Sélectionner votre nom</option>
            {profs.map((prof) => (
              <option key={prof._id} value={prof._id}>
                {prof.nom}
                
              </option>
            ))}
          </select>
        </div>
        <div className="action">
          <button
            className="btn"
            disabled={!selected}
            onClick={() => {
              setModalIsOpen(true)
            }}
          >
            Commencer le quizz
          </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          ariaHideApp={false}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h2>Vérification</h2>

          <p>Entrez votre date de naissance</p>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="modal-input"
          />

          <div className="modal-actions">
            <button
              className="btn btn-cancel"
              onClick={() => setModalIsOpen(false)}
            >
              Annuler
            </button>
            <button className="btn" onClick={verification}>
              Valider
            </button>

          </div>
          </Modal>

          {/* <button 
            className="btnclassement"
            onClick={chargerClassement}
            >🏆 Voir le classement
          </button> */}

          <Modal
            isOpen={classementOpen}
            onRequestClose={() => setClassementOpen(false)}
            ariaHideApp={false}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <h2>🏆 Classement</h2>

            <table className="classement-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Nom</th>
                  <th>Score total</th>
                </tr>
              </thead>

              <tbody>
                {classement.map((j, index) => (
                  <tr key={j._id}>
                    <td>{index + 1}</td>
                    <td>{j.nom}</td>
                    <td>{j.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-cancel"
              onClick={() => setClassementOpen(false)}
            >
              Fermer
            </button>
          </Modal>
  
        </div>

      </div>
    </main>
  );
}