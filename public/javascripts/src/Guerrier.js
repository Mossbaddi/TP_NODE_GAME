import { Personnage } from "./Personnage.js";
import { Spell } from "./Spell.js";

const imgstock = [
	"/images/Guerriers/guerrier1.png",
	"/images/Guerriers/guerrier2.png",
	"/images/Guerriers/guerrier3.png",
	"/images/Guerriers/guerrier4.png",
	"/images/Guerriers/guerrier5.png",
	"/images/Guerriers/guerrier6.png",
	"/images/Guerriers/guerrier7.png",
	"/images/Guerriers/guerrier8.png",
];

class Guerrier extends Personnage {
	attaques = [
		new Spell("Hache tournoyante", 40, 10, () => {
			console.log("*** FOIIUUUUU ***");
		}),
		new Spell("Hache Fracassante", 20, 5, () => {
			console.log("*** FRACAS ***");
		}),
		new Spell("Execution", 100, 40, () => {
			console.log("*** WAW QUELLE FORCE !!!! ***");
		}),
	];
	color = "#FF0000";

	constructor(name, id, img) {

		super(name, id, img === undefined ? imgstock : [img]);
		super.getcolor();
		// debugger;
		this.hp = 100;
		this.stamina = 100;
		this.strength = 15;
	}
}

export { Guerrier };
