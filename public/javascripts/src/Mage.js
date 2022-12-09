import { Personnage } from "./Personnage.js";
import { Spell } from "./Spell.js";

const imgstock = [
	"/images/Mages/mage1.png",
	"/images/Mages/mage2.png",
	"/images/Mages/mage3.png",
	"/images/Mages/mage4.png",
	"/images/Mages/mage5.png",
	"/images/Mages/mage6.png",
	"/images/Mages/mage7.png",
	"/images/Mages/mage8.png",
	"/images/Mages/mage9.png",
	"/images/Mages/mage10.png",
	"/images/Mages/mage11.png",
	"/images/Mages/mage12.png",
	"/images/Mages/mage13.png",
];

class Mage extends Personnage {
	attaques = [
		new Spell("Boule de feu", 40, 10, () => {
			console.log(" *** Phrase magique lancant du feu ***");
		}),
		new Spell("Boule de glace", 20, 5, () => {
			console.log("*** Phrase magique qui lance un projectile mieux qu'une boule de neige ***");
		}),
		new Spell("Explosion", 100, 40, () => {
			console.log("*** BOUMMMMMMM !!!! ***");
		}),
	];

	color = "#0000FF";

	constructor(name, id, img) {
		super(name, id, img === undefined ? imgstock : [img]);
		super.getcolor();
		this.hp = 100;
		this.stamina = 500;
		this.strength = 40;
	}
}

export { Mage };
