import { Button, Modal, Container, Row, Col, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import LayoutCard from "../components/LayoutCard";
import { useHistory } from "react-router";
import RowSelector from "../components/RowSelector";
import ScoreButtons from "../components/ScoreButtons";
import "../Reviewer.css";

export default function Reviewer({ config, accessToken }) {
  const history = useHistory();

  const [layout, setLayout] = useState({});
  const [scoreButton, setScoreButton] = useState([]);
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    type: "",
    title: "",
    body: "",
  });

  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  // Helper to parse a consecutive row range, e.g. "2-10"
  function parseConsecutiveRowRange(rangeStr) {
    if (!rangeStr) return null;
    const [start, end] = rangeStr.split("-").map(Number);
    if (isNaN(start) || isNaN(end) || start > end) return null;
    // Spreadsheet row 2 is index 0 in rowObjs
    return { start: start - 2, end: end - 2 };
  }

  // Track the allowed row range for review
  const [allowedRange, setAllowedRange] = useState({ start: 0, end: null });

  useEffect(() => {
    const initialize = async () => {
      try {
        const { layout, sheetIndex, scoreButton, sheetId, rowRange } =
          JSON.parse(config);

        if (!(layout && scoreButton && sheetId && sheetIndex !== undefined))
          throw new SyntaxError("Wrong format");

        // Fetch rows using Google Sheets API via OAuth2
        const sheetName = await getSheetName(sheetId, sheetIndex, accessToken);
        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet?ranges=${encodeURIComponent(
          sheetName + "!A:ZZ"
        )}&majorDimension=ROWS`;

        const response = await fetch(sheetUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        if (
          !data.valueRanges ||
          !data.valueRanges[0] ||
          !data.valueRanges[0].values
        ) {
          throw new Error("No data found in the sheet.");
        }

        const values = data.valueRanges[0].values;
        const header = values[0];
        let rowObjs = values.slice(1).map((rowArr) => {
          const rowObj = {};
          header.forEach((col, i) => {
            rowObj[col] = rowArr[i] || "";
          });
          return rowObj;
        });

        // Set allowed range for RowSelector
        if (rowRange) {
          const range = parseConsecutiveRowRange(rowRange);
          if (range) {
            setAllowedRange({
              start: Math.max(range.start, 0),
              end: Math.min(range.end, rowObjs.length - 1),
            });
          } else {
            setAllowedRange({ start: 0, end: rowObjs.length - 1 });
          }
        } else {
          setAllowedRange({ start: 0, end: rowObjs.length - 1 });
        }

        setLayout(layout);
        setScoreButton(scoreButton);
        setRows(rowObjs);
        setLoading(false);
      } catch (e) {
        console.log(e);
        if (e instanceof SyntaxError) {
          setShowError(true);
          setErrorMessage({
            title: "😕 Incorrect configuration format...",
            body: "Your configuration format seems to be incorrect. Check again then re-enter it from home page.",
          });
        } else {
          setShowError(true);
          setErrorMessage({
            type: "FETCH",
            title: "😕 Error fetching the spreadsheet...",
            body: e.message,
          });
        }
      }
    };
    initialize();
  }, [config, accessToken]);

  // Clamp currentRowIndex to allowed range
  useEffect(() => {
    if (
      currentRowIndex < allowedRange.start ||
      (allowedRange.end !== null && currentRowIndex > allowedRange.end)
    ) {
      setCurrentRowIndex(allowedRange.start);
    }
  }, [allowedRange, currentRowIndex]);

  // Helper to get sheet name from index
  const getSheetName = async (sheetId, sheetIndex, accessToken) => {
    const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties`;
    const response = await fetch(metaUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const meta = await response.json();
    if (
      meta.sheets &&
      meta.sheets[sheetIndex] &&
      meta.sheets[sheetIndex].properties &&
      meta.sheets[sheetIndex].properties.title
    ) {
      return meta.sheets[sheetIndex].properties.title;
    }
    throw new Error("Cannot find sheet name.");
  };

  const errorFooter = (type) => {
    switch (type) {
      case "PARSE":
      case "FETCH":
      case "SHEET":
        return (
          <Modal.Footer>
            <Button variant="danger" disabled>
              Report a problem
            </Button>
            <Button
              onClick={() => {
                setShowError(false);
                history.push("/");
              }}
            >
              Back to home page
            </Button>
          </Modal.Footer>
        );
      default:
        return <></>;
    }
  };

  const onScore = async (newScore, column) => {
    const newRows = [...rows];
    newRows[currentRowIndex][column] = newScore;
    setRows(newRows);

    // Update the value in Google Sheets
    const { sheetId, sheetIndex } = JSON.parse(config);
    const sheetName = await getSheetName(sheetId, sheetIndex, accessToken);
    const range = `${sheetName}!${column}${currentRowIndex + 2}`; // +2 for header and 1-based index

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
        range
      )}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[newScore]],
        }),
      }
    );
  };

  return (
    <>
      <Modal show={showError}>
        <Modal.Header>
          <Modal.Title>{errorMessage.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage.body}</Modal.Body>
        {errorFooter(errorMessage.type)}
      </Modal>
      {loading && (
        <div className="loading">
          <Spinner animation="border" show={loading} />{" "}
          <span>
            <br></br>Fetching spreadsheet...
          </span>
        </div>
      )}
      {!loading && !showError && (
        <Container className="layout">
          <RowSelector
            currentRowIndex={currentRowIndex}
            setCurrentRowIndex={setCurrentRowIndex}
            numberRows={
              allowedRange.end !== null
                ? allowedRange.end - allowedRange.start + 1
                : rows.length
            }
            minRowIndex={allowedRange.start}
            maxRowIndex={allowedRange.end}
          />
          {scoreButton.map(
            ({ type, tag, lower, upper, sheetColumn }, index) => (
              <Row key={index}>
                <ScoreButtons
                  type={type}
                  tag={tag}
                  rangeLower={lower}
                  rangeUpper={upper}
                  onScore={(newScore) => onScore(newScore, sheetColumn)}
                  currentScore={
                    type === "Number"
                      ? Number(rows[currentRowIndex]?.[sheetColumn])
                      : rows[currentRowIndex]?.[sheetColumn]
                  }
                />
              </Row>
            )
          )}
          <Container style={{ width: "70%" }}>
            {layout.map((row, rowIndex) => (
              <Row key={rowIndex}>
                {row.map((col, colIndex) => (
                  <Col key={colIndex}>
                    <LayoutCard
                      title={col}
                      text={rows[currentRowIndex]?.[col]}
                    />
                  </Col>
                ))}
              </Row>
            ))}
          </Container>
        </Container>
      )}
    </>
  );
}
