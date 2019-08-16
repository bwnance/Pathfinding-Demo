export const ManhattanDistance = ([x1, y1], [x2, y2]) => {
	const dx = Math.abs(x1 - x2);
	const dy = Math.abs(y1 - y2);
	return dx + dy;
};
export const ChebyshevDistance = ([x1, y1], [x2, y2]) => {
	const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return Math.max(dx, dy)
};
export const OctileDistance = ([x1, y1], [x2, y2]) => {
	const dx = Math.abs(x1 - x2);
	const dy = Math.abs(y1 - y2);
	const F = Math.SQRT2 - 1;
    return (dx < dy) ? (F * dx) + dy : (F * dy) + dx
};
export const EuclidianDistance = ([x1, y1], [x2, y2]) => {
	const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    return Math.sqrt(dx * dx + dy * dy)
};
