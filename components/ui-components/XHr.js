function XHr({ color, width = "100%", marginLeft, height = "2px" }) {
  return (
    <div
      style={{
        borderTop: `${height} solid ${color}`,
        width: width,
        margin: "20px 0px",
        marginLeft: marginLeft,
      }}
    ></div>
  );
}

export default XHr;
