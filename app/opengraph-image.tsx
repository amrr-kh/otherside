import { ImageResponse } from "next/og";

export const alt = "OtherSide — See the reality behind the veil.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d1111",
          color: "#f3e8d8",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 10,
            color: "#b9673f",
            textTransform: "uppercase",
          }}
        >
          Premium unisex fashion · Egypt
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 132,
            fontStyle: "italic",
            letterSpacing: 2,
          }}
        >
          OtherSide
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#c88a6a" }}>
          See the reality behind the veil.
        </div>
      </div>
    ),
    size,
  );
}
