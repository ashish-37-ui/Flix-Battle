import { useState, useEffect } from "react";
import data from "../../data/data";
import "./Battle.css";
import { getBattleData, saveBattleData } from "../../utils/battleStorage";
import { getUserId } from "../../utils/user";

import BattleHeader from "./BattleHeader";
import VoteSection from "./VoteSection";
import ResultsSection from "./ResultsSection";
import OpinionSection from "./OpinionSection";

function Battle() {
  // 🔹 Voting state

  const [votesA, setVotesA] = useState(() => {
    const data = getBattleData(0);
    return data ? data.votesA : 0;
  });

  const [votesB, setVotesB] = useState(() => {
    const data = getBattleData(0);
    return data ? data.votesB : 0;
  });

  const [opinions, setOpinions] = useState(() => {
    const data = getBattleData(0);
    return data ? data.opinions : [];
  });

  const [hasVoted, setHasVoted] = useState(() => {
    const data = getBattleData(0);
    return data ? data.hasVoted : false;
  });

  // 🔹 Battle navigation
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔹 Opinion state
  const [opinionText, setOpinionText] = useState("");

  const [showOpinions, setShowOpinions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const userId = getUserId();

  const battle = data[currentIndex];

  useEffect(() => {
    const savedData = getBattleData(currentIndex);

    if (savedData) {
      setVotesA(savedData.votesA);
      setVotesB(savedData.votesB);
      setOpinions(savedData.opinions || []);
      setHasVoted(savedData.hasVoted);
    } else {
      setVotesA(0);
      setVotesB(0);
      setOpinions([]);
      setHasVoted(false);
    }

    setShowOpinions(false);
    setOpinionText("");
    setSelectedOption(null);
  }, [currentIndex]);

  // ✅ USEEFFECT #2 — SAVE DATA (RIGHT AFTER FIRST ONE)
  useEffect(() => {
    saveBattleData(currentIndex, {
      votesA,
      votesB,
      opinions,
      hasVoted,
    });
  }, [votesA, votesB, opinions, hasVoted, currentIndex]);

  // 🔹 Calculations
  const totalVotes = votesA + votesB;

  const percentA =
    totalVotes === 0 ? 0 : ((votesA / totalVotes) * 100).toFixed(0);
  const percentB =
    totalVotes === 0 ? 0 : ((votesB / totalVotes) * 100).toFixed(0);

    const topOpinion =
  opinions.length === 0
    ? null
    : [...opinions].sort((a, b) => b.likes.length - a.likes.length)[0];


  // 🔹 Vote handlers
  const voteA = () => {
    if (hasVoted) return;
    setVotesA(votesA + 1);
    setSelectedOption(battle.optionA);
    setHasVoted(true);
  };

  const voteB = () => {
    if (hasVoted) return;
    setVotesB(votesB + 1);
    setSelectedOption(battle.optionB);
    setHasVoted(true);
  };

  // 🔹 Submit opinion
  const submitOpinion = () => {
    if (!opinionText.trim()) return;

    setOpinions([
      ...opinions,
      {
        option: selectedOption,
        text: opinionText,
        id: Date.now(),
        userId: userId,
        likes: [],
      },
    ]);

    setOpinionText("");
  };

  const likeOpinion = (opinionId) => {
    setOpinions((prevOpinions) =>
      prevOpinions.map((op) => {
        if (op.id !== opinionId) return op;

              


        // ❌ user cannot like their own opinion
        if (op.userId === userId) return op;

        // ❌ user cannot like twice
          if (op.userId === userId) return op;
        if ((op.likes|| []).includes(userId)) return op;

        // ✅ add like
        return {
          ...op,
          likes: [...op.likes || [], userId],
        };
      })
    );
  };

  console.log("Before:", opinions);


  // 🔹 Next battle
  const nextBattle = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setCurrentIndex(nextIndex);

    setVotesA(0);
    setVotesB(0);
    setHasVoted(false);

    setOpinions([]);
    setShowOpinions(false);
    setOpinionText("");
    setSelectedOption(null);
  };

  return (
    <div className="battle-page">
      <BattleHeader
        title={battle.title}
        current={currentIndex + 1}
        total={data.length}
      />

      <div className="battle-area">
        <div className="battle-poster">{battle.optionA}</div>
        <div className="vs-text">VS</div>
        <div className="battle-poster">{battle.optionB}</div>
      </div>

      <VoteSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        hasVoted={hasVoted}
        onVoteA={voteA}
        onVoteB={voteB}
      />

      <OpinionSection
        hasVoted={hasVoted}
        opinionText={opinionText}
        setOpinionText={setOpinionText}
        onSubmit={submitOpinion}
        opinions={opinions}
        showOpinions={showOpinions}
        toggleOpinions={() => setShowOpinions(!showOpinions)}
        likeOpinion={likeOpinion}
        userId={userId}
      />

      <ResultsSection
        optionA={battle.optionA}
        optionB={battle.optionB}
        votesA={votesA}
        votesB={votesB}
        percentA={percentA}
        percentB={percentB}
      />

      <div style={{ marginTop: "40px" }}>
        <button onClick={nextBattle}>Next Battle →</button>
      </div>
    </div>
  );
}

export default Battle;
