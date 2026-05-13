import { LSystem } from "@rgsoft/turtle";

export class LSystemGenerator {
	private lsystem: LSystem;
	private sentence: string = "";

	constructor(axiom: string, rules: Record<string, string>) {
		// Преобразуем объект правил в массив строк вида "A->B"
		const rulesArray = Object.entries(rules).map(
			([from, to]) => `${from}->${to}`,
		);
		this.lsystem = new LSystem(axiom, rulesArray);
	}

	generate(iterations: number) {
		this.lsystem.generate(iterations);
		this.sentence = this.lsystem.sentence; // вместо .getString()
		console.log("L-system sentence:", this.sentence);
	}

	interpret(stepSize: number = 0.5, angle: number = Math.PI / 6) {
		const stack: {
			pos: { x: number; y: number; z: number };
			dir: { x: number; y: number; z: number };
		}[] = [];
		let pos = { x: 0, y: 0, z: 0 };
		let dir = { x: 1, y: 0, z: 0 };
		const points: { start: typeof pos; end: typeof pos }[] = [];

		for (const char of this.sentence) {
			switch (char) {
				case "F":
				case "G":
					const next = {
						x: pos.x + dir.x * stepSize,
						y: pos.y + dir.y * stepSize,
						z: pos.z + dir.z * stepSize,
					};
					points.push({ start: { ...pos }, end: { ...next } });
					pos = next;
					break;
				case "+":
					const rad = angle;
					const newDirX = dir.x * Math.cos(rad) - dir.z * Math.sin(rad);
					const newDirZ = dir.x * Math.sin(rad) + dir.z * Math.cos(rad);
					dir = { x: newDirX, y: dir.y, z: newDirZ };
					break;
				case "-":
					const radNeg = -angle;
					const newDirXNeg =
						dir.x * Math.cos(radNeg) - dir.z * Math.sin(radNeg);
					const newDirZNeg =
						dir.x * Math.sin(radNeg) + dir.z * Math.cos(radNeg);
					dir = { x: newDirXNeg, y: dir.y, z: newDirZNeg };
					break;
				case "[":
					stack.push({ pos: { ...pos }, dir: { ...dir } });
					break;
				case "]":
					const saved = stack.pop();
					if (saved) {
						pos = saved.pos;
						dir = saved.dir;
					}
					break;
			}
		}
		return points;
	}
}
