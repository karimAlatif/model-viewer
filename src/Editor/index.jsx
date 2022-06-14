//Libs
import React, {
  createRef,
  createContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { Typography, Layout, Menu, Button } from "antd";

//Components
import BabylonManager from "../BabylonManager";

// import EditorButtons from './EditorButtons';

//
const { Header } = Layout;
const { Title } = Typography;

const gmRef = createRef(null);
export const GmContext = createContext(null);
//

const Editor = () => {
  const [gameManager, setGameManager] = useState(null);
  const studioSceneHandlers = useMemo(() => {
    return {
      onSelect: (params) => {},
      onDrag: () => {
        console.log("Ui Drag Action !!");
      },
      onDrop: () => {
        console.log("Ui Drop Action !!");
      },
      onDeselect: () => {},
    };
  }, []);

  useEffect(() => {
    const GManger = BabylonManager(gmRef.current).GManger; //Create Babylonjs Ref
    GManger.studioSceneManager.handlers = studioSceneHandlers; //Hnadlers
    setGameManager(GManger);
  }, [setGameManager, studioSceneHandlers]);

  return (
    <GmContext.Provider value={gameManager}>
        <Row style={{ height: "100%", overflow: "hidden" }} type="flex">
          <Col span={24} style={{ height: "100%" }}>
            <canvas {...{}} className="canvas" ref={gmRef} />
          </Col>
        </Row>
    </GmContext.Provider>
  );
};
export default Editor;

// On Windows Shift + Alt + F.
// On Mac Shift + Option + F.
