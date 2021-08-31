export default ({ object, startPoint, mouse }) => {
    const angle = Math.atan2(
        startPoint.objectX + (object.width || 0) / 2 - mouse.x,
        startPoint.objectY + (object.height || 0) / 2 - mouse.y
    );

    const asDegree = angle * 180 / Math.PI;
    const rotation = (asDegree + 45) * -1;

    return {
        ...object,
        rotate: rotation
    };
};
