import { changevaluewithid } from "./Ui.js";
import { Spell } from "./Spell.js";

class Personnage {
	// Declaration attribut en dehors du constructeur

	_hp = 100;
	_strength = 10;
	_stamina = 25;
	opponent = null;
	attaques = [];
	id = 1;
	hexcolor = "#000000";
	hexToRGB(hex, opacity) {
		var r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);

		if (opacity) {
			return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
		} else {
			return "rgb(" + r + ", " + g + ", " + b + ")";
		}
	}

	getcolor() {
		var img = document.createElement("img");

		img.setAttribute("src", this.imgsrc);

		img.addEventListener("load", () => {
			var vibrant = new Vibrant(img);
			var swatches = vibrant.swatches();
			var color = swatches["Vibrant"].getHex();
			this.hexcolor = color;
			this.color = this.hexToRGB(color, 0.4);
		});
	}

	constructor(name, id, imgstock = ["../assets/Peon/peon.png"]) {
		this.name = name;
		if (id != undefined) {
			this.id = id;
		}
		this.imgsrc = imgstock[Math.floor(Math.random() * imgstock.length)];
	}

	subirDommage(montant_dommage) {
		this.hp -= montant_dommage;
	}

	jouertour(choix) {
		this.attaques[choix - 1].cast(this, this.opponent);
	}

	get hp() {
		return this._hp;
	}

	get stamina() {
		return this._stamina;
	}

	set hp(value) {
		this._hp = value;
		changevaluewithid("hp" + this.id, "HP : " + value);
		if (value <= 0) {
			fetch("/api/" + ((this.id == 1) ? "defaite" : "victoire"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id: this.id,
				}),
			}).then((response) => {
				if (response.status == 200) {
					window.location.href = "/" + ((this.id == 1) ? "defeat" : "victory");
				}
			}
			).catch
				((error) => {
					console.error("Error:", error);
				});
		}
	}

	set stamina(value) {
		this._stamina = value;
		changevaluewithid("stamina" + this.id, "Stamina : " + value);
	}

	afficherCoups() {
		let i = 1;
		// effacer les boutons
		$("#attaques").empty();
		for (let attaque of this.attaques) {
			// Creer un bouton pour chaque attaque
			$("#attaques").append(
				`<button class="btn" style="--color:${this.hexcolor};--color2:${this.hexcolor};" id="Attaque${i}">${attaque.nom}</button>`,
			);

			i++;
		}
		$("#card" + this.id).removeClass("trigger");
		$("#card" + (this.id + (this.id == 1 ? 1 : -1))).addClass("trigger");
	}
}

export { Personnage };
