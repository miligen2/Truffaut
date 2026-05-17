"use client"
import { useEffect, useState } from "react"
import "./page.css"
import { useRouter } from "next/navigation";

type Prof = { _id: string, nom: string };
type Rebus = {_id: string, image: string, reponse: string}

export default function Dashboard() {
    const router = useRouter();
    const [prof, setProf] = useState<Prof | null>(null);
    const [rebus, setRebus] = useState<Rebus[]>([]);

    useEffect(() =>{
        const userId = localStorage.getItem('userId');
        fetch(`/api/profs/${userId}`)
        .then((r)=> r.json())
        .then((data => {
            console.log("PROF DATA:", data);
            setProf(data)
        }))
        .catch((e)=> {
            console.error('FETCH ERROR:',e)
        })
    }, [])

    useEffect(() =>{
        const userId = localStorage.getItem('userId');
        fetch(`/api/rebus?userId=${userId}`)
        .then((r) => r.json())
        .then((data)=> {
            console.log("REBUS DATA:" , data)
            setRebus(Array.isArray(data) ? data : [])
        }).catch((e)=>{
            console.error('FETCH ERROR:', e)
        })
    }, [])

    return (
        <>
            <main className="main">
            <div className="dashboard">
                <span className="badge">
                {prof ? `Bienvenue M / Mme ${prof.nom} !` : "Chargement..."}
                </span>

                <div className="grid">
                {rebus.map((r) => (
                    <div key={r._id} onClick={!r.resultats?.success ? () => router.push(`/rebus/${r._id}`): undefined} className="question-card">
                        {!r.resultats ? (<div className="question-mark">?</div>) : (<div className="question-mark-done">✔</div>)}

                        <p>{r._id.charAt(0).toUpperCase() + r._id.slice(1)}</p>
                    </div>
                ))}
                </div>

            </div>
            </main>
        </>
    )
}