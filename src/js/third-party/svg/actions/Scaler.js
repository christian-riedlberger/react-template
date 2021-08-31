export default ({ object, startPoint, mouse }) => {
    const { objectX, objectY, clientX, clientY } = startPoint;
    const width = startPoint.width + mouse.x - clientX;
    const height = startPoint.height + mouse.y - clientY;

    return {
        ...object,
        x: width > 0 ? objectX : objectX + width,
        y: height > 0 ? objectY : objectY + height,
        width: Math.abs(width),
        height: Math.abs(height)
    };
};
