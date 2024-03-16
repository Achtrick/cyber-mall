function XGridSkeleton({ title }) {
  return (
    <section
      style={{
        width: "100%",
        padding: "10px",
      }}
    >
      <h2 align="center">{title}</h2>
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "auto auto auto auto auto auto ",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
            src="/images/image-placeholder.jpg"
          />
        </div>
      </div>
    </section>
  );
}

export default XGridSkeleton;
