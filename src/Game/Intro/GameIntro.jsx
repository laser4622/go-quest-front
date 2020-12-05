import React, {useState} from 'react';
import {observer} from "mobx-react";
import Dialog from "../Dialog/Dialog";
import appStore from "../../store";
import {Register} from "../../Register";
import './GameIntro.css'
import withRouter from "react-router-dom/es/withRouter";
import {Login} from "../../Login";

const introSteps = require('../../gameplay/stories/intro-steps.json')

export const GameIntro = observer((props) => {
    const {intro} = appStore;
    const step = introSteps.find(step => step.id === intro.currentStep);
    const [showLogin, setShowLogin] = useState(false);

    if(showLogin) {
        return (
            <>
                <div onClick={()=>setShowLogin(false)}>Назад</div>
                <Login/>
            </>
        )
    }

    if(step.id === 'welcome') {
        return (
            <div onClick={()=>appStore.updateIntroStep(step.next)} className="welcome">
                <div className="welcome-info">
                    Добро пожаловать в онлайн-квест «Защити себя от вич»
                    <div className="welcome-continue">Для продолжения нажмите в любую точку экрана.</div>
                    <div className="welcome-login" onClick={(e)=>{e.stopPropagation();setShowLogin(true)}}>Уже играли? <div className="go">Войдите</div></div>
                </div>
            </div>
        )
    }

    if (step.id === 'register') {
        return (
            <Register/>
        )
    }

    return (
        <Dialog
            char={step.char}
            position={step.position}
            text={step.text}
            next={() => appStore.updateIntroStep(step.next)}
            background={step.background}
        />
    )
})