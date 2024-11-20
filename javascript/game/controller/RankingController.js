import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { LocalStorageController } from "./LocalStorageController.js";

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDaR2WQvf7kfUPj_il9Ip6BWDJXvTAFVF8",
    authDomain: "hanoi-tower-2b574.firebaseapp.com",
    databaseURL: "https://hanoi-tower-2b574-default-rtdb.firebaseio.com",
    projectId: "hanoi-tower-2b574",
    storageBucket: "hanoi-tower-2b574.firebasestorage.app",
    messagingSenderId: "479244735005",
    appId: "1:479244735005:web:185f6a0b5704e2f25aecf4"
};

const COLLECTION_NAME = "ranking";

class RankingController {
    #db = undefined;
    #rankingSectionElement = document.getElementById("ranking-panel");
    #cardsSectionElement = document.getElementById("cards");

    constructor() {
        const app = initializeApp(FIREBASE_CONFIG);
        this.#db = getFirestore(app);

        this.#fetchScores();
        this.#getRanking();
    }

    #getRanking = async () => {
        const id = LocalStorageController.getLastGameData()?.id;

        if (!id) return;

        try {
            const docRef = doc(this.#db, COLLECTION_NAME, id);

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const name = data.username || "Anonymous";
                const score = data.score || 0;

                const divider = document.createElement("hr");
                divider.classList.add("divider");

                this.#rankingSectionElement.appendChild(divider);

                const userCardElement = document.createElement("div");
                userCardElement.classList.add("card");
                userCardElement.classList.add("user-card");

                const positionElement = document.createElement("p");
                positionElement.textContent = "";

                const nameElement = document.createElement("p");
                nameElement.textContent = name;

                const scoreElement = document.createElement("p");
                scoreElement.textContent = score;

                userCardElement.appendChild(positionElement);
                userCardElement.appendChild(nameElement);
                userCardElement.appendChild(scoreElement);

                this.#rankingSectionElement.appendChild(userCardElement);
            }
        } catch (error) {
            console.error("Erro ao buscar documento:", error);
        }
    }

    async addRanking(ranking) {
        await this.db.collection(COLLECTION_NAME).add(ranking);
    }

    #fetchScores = async () => {
        const qry = query(collection(this.#db, COLLECTION_NAME), orderBy("score", "desc"), limit(10));
        const result = await getDocs(qry);

        let position = 1;
        result.forEach(doc => {
            const data = doc.data();
            const name = data.username || "Anonymous";
            const score = data.score || 0;

            const cardElement = document.createElement("div");
            cardElement.classList.add("card");

            const positionElement = document.createElement("p");
            positionElement.textContent = position;

            const nameElement = document.createElement("p");
            nameElement.textContent = name;

            const scoreElement = document.createElement("p");
            scoreElement.textContent = score;

            cardElement.appendChild(positionElement);
            cardElement.appendChild(nameElement);
            cardElement.appendChild(scoreElement);

            this.#cardsSectionElement.appendChild(cardElement);

            position++;
        });
    }
}

new RankingController();