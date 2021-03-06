import React, {useEffect, useState} from 'react';
import appStore from "../store";
import {observer} from "mobx-react";
import Dialog from "../Game/Dialog/Dialog";
import Menu from "../Game/Menu/Menu";
import Woman from "../Game/Woman/Woman";

export const Main = observer(({onEnd}) => {
    const [step, setStep] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        appStore.playMainGame().then(setStep).catch(alert);
    }, []);

    const saveDialog = () => {
        if(loading)
            return;

        setLoading(true);
        appStore
            .saveMainGame({isDialog: true})
            .then(newStep => {
                setStep(newStep);
                setLoading(false);
            })
            .catch(alert);
    }

    const saveGame = (result) => {
        if(loading)
            return;

        setLoading(true);
        appStore.saveMainGame(result)
            .then(newStep => {
                setStep(newStep);
                setLoading(false);
            })
            .catch(alert);
    }

    if(!step) return <div style={{marginTop: '70%'}} className="loader"/>

    if(step.id === 'card_end' || step.id === 'save_woman' || step.id === 'game_over' || step.id === 'win') {
        onEnd()
        return null;
    }


    const { activity } = step;

    if(activity.type === 'select_woman_name') {
        return <Woman next={saveDialog}/>
    }

    if(activity.type === 'dialog') {
        return <Dialog text={activity.text} background={step.background} char={step.char} next={saveDialog} position={step.position}/>
    }

    if(activity.type === 'radio') {
        return <Dialog
            next={(res)=>saveGame(res)}
            text={activity.question}
            actions={activity.answers.map(i => i.text)}
            position={step.position}
            background={step.background}
            char={step.char}
            choose={1}
        />
    }
})