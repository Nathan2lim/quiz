import { useLocation } from "react-router-dom";

function Resultats() {
  const location = useLocation();
  
  // On récupère la query string, par exemple : ?score=5&total=10
  const searchParams = new URLSearchParams(location.search);
  const score = searchParams.get("score");
  const total = searchParams.get("total");

  return (
    <div>
      <h1>Résultats</h1>
      <p>Score : {score} / {total}</p>
    </div>
  );
}

export default Resultats;
