import React, {  Component  } from 'react';
import Radium from 'radium';

const styles = {
    vertex: {
        fill: '#3381ff',
        strokeWidth: 0
    },
    initialVertex: {
        fill: '#ffd760'
    },
    edge: {
        stroke: '#b9b9b9'
    },
    canvas: {
        position: 'absolute'
    }
};

class BezierEditor extends Component {
    state = {
        mode: 'source'
    };

    getMouseCoords(event) {
        const { object, offset } = this.props;
        return {
            x: event.clientX - offset.x - (object.x - object.moveX),
            y: event.clientY - offset.y - (object.y - object.moveY)
        };
    }

    componentWillMount() {
        const { object } = this.props;
        if (!object.path.length) {
            this.props.onUpdate({
                path: [
                    { x1: object.x, y1: object.y }
                ],
                moveX: object.x,
                moveY: object.y
            });
        } else {
            this.setState({
                mode: 'edit'
            });
        }
    }

    getCurrentPath() {
        const { path } = this.props.object;
        return path[path.length - 1];
    }

    updatePath(updates, index) {
        const { path } = this.props.object;
        const current = path[index];

        this.props.onUpdate({
            path: [
                ...path.slice(0, index),
                {
                    ...current,
                    ...updates
                },
                ...path.slice(index + 1)
            ]
        });
    }

    updateCurrentPath(updates, close = false) {
        const { path } = this.props.object;
        const current = this.getCurrentPath();

        this.props.onUpdate({
            closed: close,
            path: [
                ...path.slice(0, path.length - 1),
                {
                    ...current,
                    ...updates
                }
            ]
        });
    }

    onMouseMove = (event) => {
        const { mode } = this.state;
        // const currentPath = this.getCurrentPath();
        const mouse = this.getMouseCoords(event);
        const { object } = this.props;
        const { moveX, moveY } = object;
        let { x, y } = mouse;

        const snapToInitialVertex = (
            this.isCollides(moveX, moveY, x, y)
        );

        if (snapToInitialVertex) {
            x = moveX;
            y = moveY;
        }

        if (mode === 'source') {
            this.updateCurrentPath({
                x1: mouse.x,
                y1: mouse.y
            });
        }

        if (mode === 'target') {
            this.updateCurrentPath({
                x2: x,
                y2: y,
                x,
                y
            })
        }

        if (mode === 'connect') {
            this.updateCurrentPath({ x, y })
        }

        if (mode === 'target' || mode === 'connect') {
            this.setState({
                closePath: snapToInitialVertex
            });
        }

        if (mode === 'move') {
            const { movedPathIndex, movedTargetX, movedTargetY } = this.state;
            this.updatePath({
                [movedTargetX]: x,
                [movedTargetY]: y
            }, movedPathIndex);
        }

        if (mode === 'moveInitial') {
            this.props.onUpdate({
                moveX: x,
                moveY: y
            });
        }
    }

    isCollides = (x1, y1, x2, y2, radius = 5) => {
        const xd = x1 - x2;
        const yd = y1 - y2;
        const wt = radius * 2;
        return (xd * xd + yd * yd <= wt * wt);
    }

    onMouseDown = (event) => {
        if (this.state.closePath) {
            return this.closePath();
        }

        if (event.target.tagName === 'svg') {
            return this.props.onClose();
        }

        const { mode } = this.state;

        if (mode === 'target') {
            this.setState({
                mode: 'connect'
            });
        }

    }

    onMouseUp = (event) => {
        const { mode } = this.state;
        const { path } = this.props.object;
        const mouse = this.getMouseCoords(event);
        const currentPath = this.getCurrentPath();

        if (this.state.closePath) {
            return this.closePath();
        }

        if (mode === 'source') {
            this.setState({
                mode: 'target'
            });
        }

        if (mode === 'connect') {
            this.setState({
                mode: 'target'
            });
            this.props.onUpdate({
                path: [
                    ...path,
                    {
                        x1: currentPath.x + (currentPath.x - currentPath.x2),
                        y1: currentPath.y + (currentPath.y - currentPath.y2),
                        x2: mouse.x,
                        y2: mouse.y,
                        x: mouse.x,
                        y: mouse.y
                    }
                ]
            });
        }

        if (mode === 'move' || mode === 'moveInitial') {
            this.setState({
                mode: 'edit'
            });
        }
    }

    getCurrentPoint(pathIndex) {
        const { state } = this;
        const { object } = this.props;
        if (pathIndex === 0) {
            return { x: object.moveX, y: object.moveY }
        }
        const path = state.path[pathIndex - 1];
        return { x: path.x, y: path.y };
    }

    closePath() {
        this.setState({
            mode: null
        });

        this.props.onClose();

        this.updateCurrentPath({
            x: this.props.object.moveX,
            y: this.props.object.moveY
        }, true);
    }

    moveVertex = (pathIndex, targetX, targetY, event) => {
        event.preventDefault();

        if (this.state.mode !== 'edit') {
            return;
        }

        // const mouse = this.getMouseCoords(event);

        this.setState({
            mode: 'move',
            movedPathIndex: pathIndex,
            movedTargetX: targetX,
            movedTargetY: targetY
        });
    }

    moveInitialVertex() {
        this.setState({
            mode: 'moveInitial'
        });
    }

    render() {
        const { object, width, height } = this.props;
        // const { path } = object;
        // const { state } = this;
        const { moveX, moveY, x, y } = object;
        const offsetX = x - moveX
        const offsetY = y - moveY;

        return (
            <div style={styles.canvas}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onMouseDown={this.onMouseDown}>
                <svg style={{ width, height }}>
                    <g transform={`translate(${offsetX} ${offsetY})
                                                 rotate(${object.rotate} ${object.x} ${object.y})`}>
                        { object.path.map(({ x1, y1, x2, y2, x, y }, i) => (
                            <g key={i}>
                                {x2 && y2 && (
                                    <g>
                                        <line x1={x2} y1={y2}
                                            x2={x} y2={y}
                                            style={styles.edge}
                                            onMouseDown={(e) => { this.moveVertex(i, 'x', 'y', e) }} />

                                        <circle r={4} cx={x2} cy={y2}
                                            style={styles.vertex}
                                            onMouseDown={(e) => { this.moveVertex(i, 'x2', 'y2', e) }} />

                                        <circle r={4} cx={x} cy={y}
                                            style={styles.vertex}
                                            onMouseDown={(e) => { this.moveVertex(i, 'x', 'y', e) }} />
                                    </g>
                                )}
                                {i === 0 && (
                                    <g>
                                        <line x1={moveX} y1={moveY}
                                            style={styles.edge}
                                            onMouseDown={(e) => { this.moveVertex(i, 'x1', 'y1', e) }}
                                            x2={x1} y2={y1} stroke="black" />

                                        <circle style={styles.vertex} r={4} cx={x1} cy={y1}
                                            onMouseDown={(e) => { this.moveVertex(i, 'x1', 'y1', e) }} />

                                        <circle r={4} cx={moveX} cy={moveY}
                                            style={[styles.vertex, styles.initialVertex]} />
                                    </g>
                                )}
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        );
    }
}

export default Radium(BezierEditor);
