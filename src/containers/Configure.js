import {
  Modal,
  Alert,
  Col,
  Row,
  Form,
  Button,
  Dropdown,
  Spinner,
} from "react-bootstrap";
import LayoutConfigurator from "../components/LayoutConfigurator";
import ScoreButtonsConfigurator from "../components/ScoreButtonsConfigurator";
import DoneConfigure from "../components/DoneConfigure";
import { useState, useEffect, useReducer } from "react";
import { Route, Switch, useHistory } from "react-router";

export default function Configure({ accessToken }) {
  const history = useHistory();
  const [hasError, setHasError] = useState(false);
  const [selectSheet, setSelectSheet] = useState(false);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(-1);
  const [sheetId, setSheetId] = useState("");
  const [sheetColumns, setSheetColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const layoutReducer = (state, action) => {
    switch (action.type) {
      case "ADD_ROW":
        return state.concat([[""]]);
      case "ADD_COLUMN":
        return state.map((row, index) =>
          index === action.payload.rowIndex ? row.concat([""]) : row
        );
      case "DELETE_ROW":
        return state.filter((item, index) => index !== action.payload.rowIndex);
      case "DELETE_COLUMN":
        return state.map((row, index) =>
          index === action.payload.rowIndex
            ? row.filter((col, index) => index !== action.payload.colIndex)
            : row
        );
      case "MODIFY_CELL":
        return state.map((row, index) =>
          index === action.payload.rowIndex
            ? row.map((col, index) =>
                index === action.payload.colIndex
                  ? action.payload.newValue
                  : col
              )
            : row
        );
      default:
        return state;
    }
  };

  const scoreButtonReducer = (state, action) => {
    switch (action.type) {
      case "ADD_SCORE":
        return state.concat([
          {
            type: "Number",
            tag: "New Sub-score",
            lower: 0,
            upper: 10,
            sheetColumns: null,
          },
        ]);

      case "MODIFY_SCORE":
        return state.map((item, index) =>
          index === action.payload.index
            ? {
                ...item,
                [action.payload.key]: action.payload.value,
              }
            : item
        );
      case "DELETE_SCORE":
        return state.filter((_, index) => index !== action.payload.index);
      default:
        return state;
    }
  };

  const [layoutState, layoutDispatch] = useReducer(layoutReducer, [[""]]);
  const [scoreButtonState, scoreButtonDispatch] = useReducer(
    scoreButtonReducer,
    [
      {
        type: "Number",
        tag: "Overall Score",
        lower: 0,
        upper: 10,
        sheetColumn: null,
      },
    ]
  );

  // Fetch sheet metadata using OAuth
  const fetchSheetsMeta = async (sheetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const sheets = (await response.json()).sheets;
      if (!sheets) throw new Error("No sheets found");

      setData(sheets);
      setLoading(false);
      return sheets;
    } catch (err) {
      setError(err);
      setLoading(false);
      return [];
    }
  };

  // Fetch columns for a selected sheet using OAuth
  const fetchSheetColumns = async (sheetId, sheetTitle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
          sheetTitle
        )}!A1:ZZ1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = await response.json();

      console.log("Fetched columns:", result);
      const columns = result.values && result.values[0] ? result.values[0] : [];
      setSheetColumns(columns);
      setLoading(false);
      return columns;
    } catch (err) {
      setError(err);
      setLoading(false);
      return [];
    }
  };

  const onPasteSheetId = async (e) => {
    const value = e.target.value;
    setSheetId(value);
    setSelectedSheetIndex(-1);
    setSheetColumns([]);
    if (value) {
      const sheets = await fetchSheetsMeta(value);
      if (sheets.length > 0) setSelectSheet(true);
      else setHasError(true);
    }
  };

  const onSelectSheet = async (index) => {
    setSelectedSheetIndex(index);
    const sheetTitle = data[index].properties.title;
    await fetchSheetColumns(sheetId, sheetTitle);
    history.push("/configure/layout");
  };

  const onConfirmLayout = () => {
    history.push("/configure/score");
  };

  const onBackFromScore = () => {
    history.push("/configure/layout");
  };

  const onConfirmScore = () => {
    history.push("/configure/done");
  };

  const onBackFromDone = () => {
    history.push("/configure/score");
  };

  const onGoToHome = () => {
    history.push("/start");
  };

  useEffect(() => {
    if (data.length >= 1 && selectedSheetIndex === -1) setSelectSheet(true);
  }, [data, selectedSheetIndex]);

  return (
    <>
      <Row>
        {/* Show Step 1 modal only when no sheetId is entered */}
        <Modal show={!sheetId && !error && !loading}>
          <Modal.Header>
            <Modal.Title>📖 Step 1: Connect to your Google Sheet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Alert key={0} variant="warning" show={hasError}>
              There is an error fetching your sheet - try again!
            </Alert>
            <ol>
              <li>Go to your Google Sheet spreadsheet page</li>
              <li>Share it with "Anyone with this link can edit"</li>
              <li>
                Get "sheet id" from url of the sheet:
                <br />
                <code>
                  https://docs.google.com/spreadsheets/d/
                  <span style={{ fontWeight: "bold" }}>
                    [THIS-IS-THE-SHEET-ID]
                  </span>
                  /...
                </code>
                <br />
                For example, if the spreadsheet url is <br />
                <code>
                  https://docs.google.com/spreadsheets/d/1mAk682d8dRMqzRg-w9PUPa4XTRjphMc3w4CdkVfdfaas/edit#gid=0
                </code>
                <br /> then the sheet ID is <br />
                <code>1mAk682d8dRMqzRg-w9PUPa4XTRjphMc3w4CdkVfdfaas</code>
              </li>
              <li>Paste it here</li>
            </ol>
            <Form>
              <Form.Group controlId="formSheetID">
                <Form.Control
                  placeholder="Paste sheet ID"
                  value={sheetId}
                  onChange={onPasteSheetId}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal show={selectSheet}>
          <Modal.Header>
            <Modal.Title>Select a sheet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Select a sheet in your spreadsheet to continue.
          </Modal.Body>
          <Modal.Footer>
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {selectedSheetIndex === -1
                  ? "Select..."
                  : data[selectedSheetIndex]?.properties?.title ||
                    data[selectedSheetIndex]?.id}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {data.map((item, index) => (
                  <Dropdown.Item
                    key={item.properties?.index ?? item.id ?? index}
                    onSelect={() => onSelectSheet(index)}
                  >
                    {item.properties?.title || item.id}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="success"
              disabled={selectedSheetIndex === -1}
              onClick={() => setSelectSheet(false)}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
        <Col>
          {error ? (
            <></>
          ) : loading ? (
            <div className="loading">
              <Spinner animation="border" show={loading} />{" "}
              <span>
                <br />
                Fetching spreadsheet...
              </span>
            </div>
          ) : (
            <Switch>
              <Route path="/configure/layout">
                <>
                  <LayoutConfigurator
                    state={layoutState}
                    dispatch={layoutDispatch}
                    sheetColumns={sheetColumns}
                    sheet={data[selectedSheetIndex]}
                  />
                  <div className="configurator-confirm">
                    <Button
                      variant="success"
                      disabled={
                        // any empty row
                        layoutState.reduce(
                          (acc, row) =>
                            row.reduce(
                              (acc, col) => col === "" || acc,
                              false
                            ) || acc,
                          false
                        )
                      }
                      onClick={onConfirmLayout}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              </Route>
              <Route path="/configure/score">
                <>
                  <ScoreButtonsConfigurator
                    state={scoreButtonState}
                    dispatch={scoreButtonDispatch}
                    sheetColumns={sheetColumns}
                  />
                  <div className="configurator-confirm">
                    <Button variant="secondary" onClick={onBackFromScore}>
                      Previous step
                    </Button>{" "}
                    <Button variant="success" onClick={onConfirmScore}>
                      Next step
                    </Button>
                  </div>
                </>
              </Route>
              <Route path="/configure/done">
                <DoneConfigure
                  config={{
                    sheetId: sheetId,
                    sheetIndex: selectedSheetIndex,
                    scoreButton: scoreButtonState,
                    layout: layoutState,
                  }}
                />
                <div className="configurator-confirm">
                  <Button variant="secondary" onClick={onBackFromDone}>
                    Previous step
                  </Button>{" "}
                  <Button variant="success" onClick={onGoToHome}>
                    Back to home page
                  </Button>
                </div>
              </Route>
            </Switch>
          )}
        </Col>
      </Row>
    </>
  );
}
