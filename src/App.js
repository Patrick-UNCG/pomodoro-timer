
import './App.css';
import React from 'react';
import Adjustors from './Adjustors';
import pipesound from './sounds/pipesound.mp3';
import augh from './sounds/augh.mp3'
import draft from './sounds/draft.mp3'
import fbi from './sounds/FBI.mp3'
import windows from './sounds/windows.mp3'

function App(){
  const [timeDisplay, setTimeDisplay] = React.useState(25*60)
  const [breakTime, setBreakTime] = React.useState(5*60)
  const [sessionTime, setSessionTime] = React.useState(25*60)
  const [timerOn, setTimerOn] = React.useState(false)
  const [onBreak, setOnBreak] = React.useState(false)
  const soundOptions = [
    {name:"Beep", value:"https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"},
    {name:"Pipesound", value:pipesound},
    {name:"Augh", value:augh},
    {name:"NBA Draft", value:draft},
    {name:"FBI", value:fbi},
    {name:"Windows Start Sound", value:windows}] 
  const [sound, setSound]= React.useState(soundOptions[0].value)
  
  
  function formatTime(time){
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return(
      (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds)
    )
  }
  
  function changeTime(amount,type){
    if(type==='break'){
      if(breakTime<=60 && amount<0){
        return;
      }
      else if(breakTime>=3600 && amount>0){
        return
      }
      setBreakTime((prev)=>prev+amount)
    }
    else{
      if(sessionTime<=60 && amount<0){
        return;
      }
      else if(sessionTime>=3600 && amount>0){
        return
      }
      setSessionTime((prev)=>prev+amount)
      if(!timerOn){
        setTimeDisplay(sessionTime+amount)
      }
    }
  }
  
  function controlTime(){
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if(!timerOn){
      let interval = setInterval(()=>{
        date = new Date().getTime();
        if(date > nextDate){
          setTimeDisplay(prev=>{
            if(prev <= 0 && !onBreakVariable){
              playBeep();
              onBreakVariable=true;
              setOnBreak(true);
              return breakTime;
            }
            else if(prev<=0 && onBreakVariable){
              playBeep();
              onBreakVariable=false;
              setOnBreak(false);
              return sessionTime;
              
            }
            return prev-1;
          })
          nextDate += second
        }
      },30)
      localStorage.clear()
      localStorage.setItem('interval-id', interval)
    }
    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'))
    }
    setTimerOn(!timerOn)
  }
  
  function resetTime(){
    const beepElement= document.getElementById("beep")
    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'))
      setTimerOn(!timerOn)
    }
    if(onBreak){
      setOnBreak(false)
    }
    beepElement.pause();
    beepElement.currentTime = 0;
    setTimeDisplay(25*60);
    setSessionTime(25*60);
    setBreakTime(5*60);
  }
  
  function playBeep(){
    
    const beepElement= document.getElementById("beep")
    beepElement.volume = 0.2;
    beepElement.currentTime = 0;
    beepElement.play();
  }
  return (
    
    <div id="container">
      <h1 id="title">Pomodoro Timer</h1>
      <h4 id="subheading">(With funny meme sounds!)</h4>
      <div id="adjustor-container">
        <Adjustors 
        id="break-label" 
        title="Break Length" 
        changeTime={changeTime} 
        type= {"break"} 
        time={breakTime} 
        formatTime={formatTime}/>
      <Adjustors 
        id="session-label" 
        title="Session Length" 
        changeTime={changeTime} 
        type= {"session"} 
        time={sessionTime} 
        formatTime={formatTime}/>
      </div>
      <h3 id="timer-label">{onBreak ? "Break" : "Session"}</h3>
      <h1 id="time-left">{formatTime(timeDisplay)}</h1>
      <div id="button-container">
        <button id="start_stop" onClick={controlTime}>{timerOn ? (<span><i className="fa-solid fa-circle-pause"></i></span>) : (<span><i className="fa-solid fa-circle-play"></i></span>)}</button>
        <button id="reset" onClick={resetTime}><i className="fa-solid fa-rotate-right"></i></button>
      </div>
      <audio id="beep" src={sound}/>
      <div>
      <h3>Sound Selection</h3>
      <select
        id="sound-options"
        onChange={(e) => setSound(e.target.value)}
        defaultValue={sound}
      >
        {soundOptions.map((option, idx) => (
          <option key={idx} value={option.value}>{option.name}</option>
        ))}
      </select>
    </div>
      <div className="footer">
        <a href="https://github.com/Patrick-UNCG/pomodoro-timer"><i id="github-link" class="fa-brands fa-github"></i></a>
      </div>
    </div>

  )
}

export default App;
