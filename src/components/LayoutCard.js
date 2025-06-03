import { Card } from "react-bootstrap";

// Helper to detect and render links in text
function renderTextWithLinks(text) {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  );
}

function linesToParagraphs(lines) {
  return lines.split("\n").map((text, idx) => (
    <span key={idx}>
      {renderTextWithLinks(text)}
      <br />
    </span>
  ));
}

export default function LayoutCard({ title, text }) {
  return (
    <Card className="layout-card">
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text === undefined ? "" : linesToParagraphs(text)}</Card.Text>
    </Card>
  );
}
