function BattleHeader({ title, current, total }) {
  return (
    <>
      <h1>{title}</h1>
      <div style={{ marginTop: "10px", marginBottom: "11px", color: "#555" }}>
        Battle {current} of {total}
      </div>
    </>
  );
}

export default BattleHeader;
