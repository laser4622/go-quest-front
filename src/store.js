import { observable, action, autorun, decorate, computed } from 'mobx'
import Cookie from "js-cookie"
import {
    registerReq,
    loginReq,
    userInfoReq,
    playGameReq,
    saveGameReq,
    selectCardReq,
    getSelectedCardsStateReq, saveMainGameReq, playMainGameReq, startMainGameReq
} from "./api";

class AppStore {
    authToken = '';
    intro = {
        currentStep: "welcome",
        finished: false,
        score: 0,
    }

    addIntroScore(score) {
        this.intro.score += +score;
        localStorage.setItem('introScore', this.intro.score);
    }

    setToken(token) {
        this.authToken = token;
        Cookie.set('authToken', token);
    }

    updateIntroStep(newStep) {
        this.intro.currentStep = newStep;
        localStorage.setItem('introStep', newStep);
    }

    async getUserInfo() {
        return (await userInfoReq(this.authToken)).data
    }

    async playGame() {
        return (await playGameReq(this.authToken)).data;
    }

    async selectCard(selectedCards) {
        return (await selectCardReq(selectedCards, this.authToken)).data
    }

    async getSelectedCardsState() {
        return (await getSelectedCardsStateReq(this.authToken)).data
    }

    async saveGame(result) {
        return (await saveGameReq(result, this.authToken)).data;
    }

    async register(data) {
        const token = (await registerReq(data, this.intro.score)).data;
        this.setToken(token);
    }

    async login(data) {
        const token = (await loginReq(data)).data;
        this.setToken(token)
    }

    async startMainGame(cardId) {
        return (await startMainGameReq(cardId, this.authToken))
    }

    async playMainGame() {
        return (await playMainGameReq(this.authToken)).data;
    }

    async saveMainGame(result) {
        return (await saveMainGameReq(result, this.authToken)).data
    }
}

decorate(AppStore, {
    authToken: observable,
    setToken: action,
    intro: observable,
    updateIntroStep: action,
    addIntroScore: action,
});

const appStore = new AppStore();

autorun(() => {
    const token = Cookie.get('authToken');

    if(token) {
        appStore.setToken(token);
    }
});

export default appStore;