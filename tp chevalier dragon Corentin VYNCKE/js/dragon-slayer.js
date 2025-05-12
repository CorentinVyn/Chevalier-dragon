'use strict';

let jeu = {};
let pv_chevalier = 0;
let pv_dragon = 0;
let init_chevalier = 0;
let init_dragon = 0;
let chevalierplusrapide = false;
let degat = 0;
let message;
let nomfichier;

function choixpartie() {
    jeu.difficulte = requestInteger(
        "Choisissez le niveau de difficulté \n1. Niveau facile\n2. Niveau Intermédiaire\n3. Niveau difficile", 1, 3
    );
}

function pointdevie() {
    if (jeu.difficulte == 1) {
        pv_chevalier = 100 + throwDices(10, 10);
        pv_dragon = 100 + throwDices(5, 10);
    } else if (jeu.difficulte == 2) {
        pv_chevalier = 100 + throwDices(10, 10);
        pv_dragon = 100 + throwDices(10, 10);
    } else {
        pv_chevalier = 100 + throwDices(7, 10);
        pv_dragon = 100 + throwDices(10, 10);
    }
    console.log("Chevalier :", pv_chevalier, "Dragon :", pv_dragon);
}

function initiative() {
    init_chevalier = throwDices(10, 6);
    init_dragon = throwDices(10, 6);
    chevalierplusrapide = init_chevalier > init_dragon;
}

function degatsinfliges() {
    degat = throwDices(3, 6);
    if (chevalierplusrapide) {
        if (jeu.difficulte == 1) {
            degat += Math.round((degat * throwDices(2, 6)) / 100);
        } else if (jeu.difficulte == 3) {
            degat -= Math.round((degat * throwDices(1, 6)) / 100);
        }
        pv_dragon -= degat;
    } else {
        if (jeu.difficulte == 1) {
            degat -= Math.round((degat * throwDices(2, 6)) / 100);
        } else if (jeu.difficulte == 3) {
            degat += Math.round((degat * throwDices(1, 6)) / 100);
        }
        pv_chevalier -= degat;
    }
    return degat;
}

function affichagestat() {
    if (chevalierplusrapide) {
        nomfichier = 'knight-winner.png';
        message = "Vous êtes le plus rapide, vous attaquez le dragon et lui infligez " + degat + " points de dommage !";
    } else {
        nomfichier = 'dragon-winner.png';
        message = "Le dragon prend l'initiative, vous attaque et vous inflige " + degat + " points de dommage !";
    }

    const html = `
        <h3>Tour n°${jeu.tour}</h3>
        <figure class="game-round">
            <img src="images/${nomfichier}" alt="">
            <figcaption>${message}</figcaption>
        </figure>
        <div class="game-state">
            <figure class="game-state_player">
                <img src="images/knight.png" alt="">
                <figcaption>${pv_chevalier > 0 ? pv_chevalier + " PV" : "Game Over"}</figcaption>
            </figure>
            <figure class="game-state_player">
                <img src="images/dragon.png" alt="">
                <figcaption>${pv_dragon > 0 ? pv_dragon + " PV" : "Game Over"}</figcaption>
            </figure>
        </div>
    `;
    document.querySelector('.game').innerHTML += html;
}

function gagnant() {
    if (pv_dragon <= 0 || pv_chevalier <= 0) {
        let messageFinal = "";
        let nomfichierFinal = "";

        if (pv_dragon <= 0) {
            nomfichierFinal = "knight-winner.png";
            messageFinal = "Vous avez vaincu le dragon, vous êtes un vrai héros !";
        } else if (pv_chevalier <= 0) {
            nomfichierFinal = "dragon-winner.png";
            messageFinal = "Vous avez perdu le combat, le dragon vous a carbonisé !";
        }

        const footerHTML = `
            <footer>
                <h3>Fin de la partie</h3>
                <figure>
                    <figcaption>${messageFinal}</figcaption>
                    <img src="images/${nomfichierFinal}" alt="fin du jeu">
                </figure>
            </footer>
        `;
        document.querySelector('.game').innerHTML += footerHTML;
    }
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/

choixpartie();
pointdevie();
jeu.tour = 0;

while (pv_chevalier > 0 && pv_dragon > 0) {
    jeu.tour += 1;
    initiative();
    degatsinfliges();
    affichagestat();
}

gagnant();
