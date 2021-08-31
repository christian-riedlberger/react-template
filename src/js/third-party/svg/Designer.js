import React, {  Component  } from 'react';
import _ from 'lodash';
import { HotKeys } from 'react-hotkeys';
import Radium from 'radium';
import InsertMenu from './panels/InsertMenu';
import SVGRenderer from './SVGRenderer';
import Handler from './Handler';
import { modes } from './constants';
import * as actions from './actions';
import { Text, Path, Rect, Circle } from './objects';
import PanelList from './panels/PanelList';

export const styles = {
    container: {
        position: 'relative'
    },
    keyboardManager: {
        outline: 'none'
    }
}

class Designer extends Component {
    static defaultProps = {
        objectTypes: {
            text: Text,
            rectangle: Rect,
            circle: Circle,
            polygon: Path
        },
        snapToGrid: 1,
        svgStyle: {  },
        insertMenu: InsertMenu
    };

    state = {
        mode: modes.FREE,
        handler: {
            top: 200,
            left: 200,
            width: 50,
            height: 50,
            rotate: 0
        },
        currentObjectIndex: null,
        selectedObjectIndex: null,
        selectedTool: null
    };

    keyMap = {
        removeObject: ['del', 'backspace'],
        moveLeft: ['left', 'shift+left'],
        moveRight: ['right', 'shift+right'],
        moveUp: ['up', 'shift+up'],
        moveDown: ['down', 'shift+down'],
        closePath: ['enter']
    };

    componentWillMount() {
        this.objectRefs = {  };
    }

    showHandler = (index) => {
        const { mode } = this.state;
        const { objects } = this.props;
        const object = objects[index];

        if (mode !== modes.FREE) {
            return;
        }

        this.updateHandler(index, object);
        this.setState({
            currentObjectIndex: index,
            showHandler: true
        });
    }

    hideHandler = () => {
        const { mode } = this.state;
        if (mode === modes.FREE) {
            this.setState({
                showHandler: false
            });
        }
    }

    getStartPointBundle = (event, object) => {
        const { currentObjectIndex } = this.state;
        const { objects } = this.props;
        const mouse = this.getMouseCoords(event);
        object = object || objects[currentObjectIndex];
        return {
            clientX: mouse.x,
            clientY: mouse.y,
            objectX: object.x,
            objectY: object.y,
            width: object.width,
            height: object.height,
            rotate: object.rotate
        };
    }

    startDrag = (mode, event) => {
        const { currentObjectIndex } = this.state;
        this.setState({
            mode,
            startPoint: this.getStartPointBundle(event),
            selectedObjectIndex: currentObjectIndex
        });
    }

    resetSelection = () => {
        this.setState({
            selectedObjectIndex: null
        });
    }

    newObject = (event) => {
        const { mode, selectedTool } = this.state;

        this.resetSelection(event);

        if (mode !== modes.DRAW) {
            return;
        }

        const { meta } = this.getObjectComponent(selectedTool);
        const mouse = this.getMouseCoords(event);

        const { objects, onUpdate } = this.props;
        const object = {
            ...meta.initial,
            type: selectedTool,
            x: mouse.x,
            y: mouse.y
        };

        onUpdate([...objects, object]);

        this.setState({
            currentObjectIndex: objects.length,
            selectedObjectIndex: objects.length,
            startPoint: this.getStartPointBundle(event, object),
            mode: meta.editor ? modes.EDIT_OBJECT : modes.SCALE,
            selectedTool: null
        });

    }

    updatePath = (object) => {
        const { path } = object;
        const diffX = object.x - object.moveX;
        const diffY = object.y - object.moveY;

        const newPath = path.map(({ x1, y1, x2, y2, x, y }) => ({
            x1: diffX + x1,
            y1: diffY + y1,
            x2: diffX + x2,
            y2: diffY + y2,
            x: diffX + x,
            y: diffY + y
        }));

        return {
            ...object,
            path: newPath,
            moveX: object.x,
            moveY: object.y
        };
    }

    updateObject = (objectIndex, changes, updatePath) => {
        const { objects, onUpdate } = this.props;

        onUpdate(objects.map((object, index) => {
            if (index === objectIndex) {
                const newObject = {
                    ...object,
                    ...changes
                };
                return updatePath ? this.updatePath(newObject) : newObject;
            }

            return object;
        }));
    }

    getOffset = () => {
        const parent = this.svgElement.getBoundingClientRect();
        const { canvasWidth, canvasHeight } = this.getCanvas();
        return {
            x: parent.left,
            y: parent.top,
            width: canvasWidth,
            height: canvasHeight
        };
    }

    applyOffset = (bundle) => {
        const offset = this.getOffset();
        return {
            ...bundle,
            x: bundle.x - offset.x,
            y: bundle.y - offset.y
        }
    }

    updateHandler = (index, object) => {
        const target = this.objectRefs[index];
        const bbox = target.getBoundingClientRect();
        const { canvasOffsetX, canvasOffsetY } = this.getCanvas();

        let handler = {
            ...this.state.handler,
            width: object.width || bbox.width,
            height: object.height || bbox.height,
            top: object.y + canvasOffsetY,
            left: object.x + canvasOffsetX,
            rotate: object.rotate
        };

        if (!object.width) {
            const offset = this.getOffset();
            handler = {
                ...handler,
                left: bbox.left - offset.x,
                top: bbox.top - offset.y
            };
        }

        this.setState({
            handler
        });
    }

    snapCoordinates = ({ x, y }) => {
        const { snapToGrid } = this.props;
        return {
            x: x - (x % snapToGrid),
            y: y - (y % snapToGrid)
        };
    }

    getMouseCoords = ({ clientX, clientY }) => {
        const coords = this.applyOffset({
            x: clientX,
            y: clientY
        });

        return this.snapCoordinates(coords);
    }

    onDrag = (event) => {
        const { currentObjectIndex, startPoint, mode } = this.state;
        const { objects } = this.props;
        const object = objects[currentObjectIndex];
        const mouse = this.getMouseCoords(event);

        const { scale, rotate, drag } = actions;

        const map = {
            [modes.SCALE]: scale,
            [modes.ROTATE]: rotate,
            [modes.DRAG]: drag
        };

        const action = map[mode];

        if (action) {
            const newObject = action({
                object,
                startPoint,
                mouse,
                objectIndex: currentObjectIndex,
                objectRefs: this.objectRefs
            });

            this.updateObject(currentObjectIndex, newObject);
            this.updateHandler(currentObjectIndex, newObject);
        }

        if (currentObjectIndex !== null) {
            this.detectOverlappedObjects(event);
        }
    }

    detectOverlappedObjects = (event) => {
        const { currentObjectIndex } = this.state;
        const mouse = this.getMouseCoords(event);

        const refs = this.objectRefs;
        const keys = Object.keys(refs);
        const offset = this.getOffset();

        const currentRect = (refs[currentObjectIndex].getBoundingClientRect());

        keys.filter(
            (object, index) => index !== currentObjectIndex
        ).forEach((key) => {
            const rect = refs[key].getBoundingClientRect();
            let { left, top } = rect;
            const { width, height } = rect;

            left -= offset.x;
            top -= offset.y;

            const isOverlapped = (
                mouse.x > left && mouse.x < left + width &&
                mouse.y > top && mouse.y < top + height &&
                currentRect.width > width &&
                currentRect.height > height
            );

            if (isOverlapped) {
                this.showHandler(Number(key));
            }
        });
    }

    stopDrag = () => {
        const { mode } = this.state;

        if (_.includes([modes.DRAG, modes.ROTATE, modes.SCALE], mode)) {
            this.setState({
                mode: modes.FREE
            });
        }
    }

    showEditor = () => {
        const { selectedObjectIndex } = this.state;

        const { objects } = this.props;
        const currentObject = objects[selectedObjectIndex];
        const objectComponent = this.getObjectComponent(currentObject.type);

        if (objectComponent.meta.editor) {
            this.setState({
                mode: modes.EDIT_OBJECT,
                showHandler: false
            });
        }
    }

    getObjectComponent = (type) => {
        const { objectTypes } = this.props;
        return objectTypes[type];
    }

    getCanvas = () => {
        const { width, height } = this.props;
        const {
            canvasWidth = width,
            canvasHeight = height
        } = this.props;
        return {
            width, height, canvasWidth, canvasHeight,
            canvasOffsetX: (canvasWidth - width) / 2,
            canvasOffsetY: (canvasHeight - height) / 2
        };
    }

    renderSVG = () => {
        const canvas = this.getCanvas();
        const { width, height } = canvas;
        const { background, backgroundImage, objects, objectTypes } = this.props;

        return (
            <SVGRenderer
                background={background}
                backgroundImage={backgroundImage}
                width={width}
                canvas={canvas}
                height={height}
                objects={objects}
                onMouseOver={this.showHandler}
                objectTypes={objectTypes}
                objectRefs={this.objectRefs}
                onRender={(ref) => { this.svgElement = ref; return ref; }}
                onMouseDown={this.newObject} />
        );
    }

    selectTool = (tool) => {
        this.setState({
            selectedTool: tool,
            mode: modes.DRAW,
            currentObjectIndex: null,
            showHandler: false,
            handler: null
        });
    }

    handleObjectChange = (key, value) => {
        const { selectedObjectIndex } = this.state;
        this.updateObject(selectedObjectIndex, {
            [key]: value
        });
    }

    handleArrange = (arrange) => {
        const { selectedObjectIndex } = this.state;
        const { objects } = this.props;
        const object = objects[selectedObjectIndex];

        const arrangers = {
            front: (rest, object) => ([[...rest, object], rest.length]),
            back: (rest, object) => ([[object, ...rest], 0])
        };

        const rest = objects.filter(
            (object, index) =>
                selectedObjectIndex !== index
        );

        this.setState({
            selectedObjectIndex: null
        }, () => {

            const arranger = arrangers[arrange];
            const [arranged, newIndex] = arranger(rest, object);
            this.props.onUpdate(arranged);
            this.setState({
                selectedObjectIndex: newIndex
            });
        });
    }

    removeCurrent = () => {
        const { selectedObjectIndex } = this.state;
        const { objects } = this.props;

        const rest = objects.filter(
            (object, index) =>
                selectedObjectIndex !== index
        );

        this.setState({
            currentObjectIndex: null,
            selectedObjectIndex: null,
            showHandler: false,
            handler: null
        }, () => {
            this.objectRefs = {  };
            this.props.onUpdate(rest);
        });
    }

    moveSelectedObject = (attr, points, event, key) => {
        const { selectedObjectIndex } = this.state;
        const { objects } = this.props;
        const object = objects[selectedObjectIndex];

        if (key.startsWith('shift')) {
            points *= 10;
        }

        const changes = {
            ...object,
            [attr]: object[attr] + points
        };

        this.updateObject(selectedObjectIndex, changes);
        this.updateHandler(selectedObjectIndex, changes);
    }

    getKeymapHandlers = () => {
        const handlers = {
            removeObject: this.removeCurrent,
            moveLeft: this.moveSelectedObject.bind(this, 'x', -1),
            moveRight: this.moveSelectedObject.bind(this, 'x', 1),
            moveUp: this.moveSelectedObject.bind(this, 'y', -1),
            moveDown: this.moveSelectedObject.bind(this, 'y', 1),
            closePath: () => this.setState({ mode: modes.FREE })
        };

        return _.mapValues(handlers, handler => (event, key) => {
            if (event.target.tagName !== 'INPUT') {
                event.preventDefault();
                handler(event, key);
            }
        });
    }

    render() {
        const { showHandler, handler, mode, selectedObjectIndex, selectedTool, readOnly } = this.state;

        const {
            objects,
            objectTypes,
            insertMenu: InsertMenuComponent
        } = this.props;

        const currentObject = objects[selectedObjectIndex];
        let isEditMode = mode === modes.EDIT_OBJECT;
        if (readOnly === true) isEditMode = false;
        const showPropertyPanel = selectedObjectIndex !== null;

        const { width, height, canvasWidth, canvasHeight } = this.getCanvas();

        let objectComponent;
        let objectWithInitial;
        let ObjectEditor;

        if (currentObject) {
            objectComponent = this.getObjectComponent(currentObject.type);
            objectWithInitial = {
                ...objectComponent.meta.initial,
                ...currentObject
            };
            ObjectEditor = objectComponent.meta.editor;
        }

        return (
            <HotKeys
                keyMap={this.keyMap}
                style={styles.keyboardManager}
                handlers={this.getKeymapHandlers()}>
                <div className="container"
                    style={{
                        ...styles.container,
                        ...this.props.style,
                        width: canvasWidth,
                        height: canvasHeight
                    }}
                    onMouseMove={this.onDrag}
                    onMouseUp={this.stopDrag}>

                    {isEditMode && ObjectEditor && (
                        <ObjectEditor object={currentObject}
                            offset={this.getOffset()}
                            onUpdate={object => this.updateObject(selectedObjectIndex, object)}
                            onClose={() => this.setState({ mode: modes.FREE })}
                            width={width}
                            height={height} />)}

                    {showHandler && (
                        <Handler
                            boundingBox={handler}
                            canResize={_(currentObject).has('width') ||
                                                 _(currentObject).has('height')}
                            canRotate={_(currentObject).has('rotate')}
                            onMouseLeave={this.hideHandler}
                            onDoubleClick={this.showEditor}
                            onDrag={e => this.startDrag(modes.DRAG, e)}
                            onResize={e => this.startDrag(modes.SCALE, e)}
                            onRotate={e => this.startDrag(modes.ROTATE, e)} />)}

                    {InsertMenuComponent && (
                        <InsertMenuComponent tools={objectTypes}
                            currentTool={selectedTool}
                            onSelect={this.selectTool} />
                    )}

                    { this.renderSVG() }

                    {showPropertyPanel && (
                        <PanelList
                            offset={this.getOffset()}
                            object={objectWithInitial}
                            onArrange={this.handleArrange}
                            onChange={this.handleObjectChange}
                            objectComponent={objectComponent} />
                    )}
                </div>
            </HotKeys>
        );
    }
}

export default Radium(Designer);
