
import './App.css';
import React from 'react';
import Adjustors from './Adjustors';

function App(){
  const [timeDisplay, setTimeDisplay] = React.useState(25*60)
  const [breakTime, setBreakTime] = React.useState(5*60)
  const [sessionTime, setSessionTime] = React.useState(25*60)
  const [timerOn, setTimerOn] = React.useState(false)
  const [onBreak, setOnBreak] = React.useState(false)
  
  
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
    beepElement.currentTime = 0;
    beepElement.play();
  }
  return (
    <div id="container">
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
        <button id="start_stop" onClick={controlTime}>{timerOn ?        (<span><i class="fa-solid fa-circle-pause"></i></span>) : (<span><i class="fa-solid fa-circle-play"></i></span>)}</button>
        <button id="reset" onClick={resetTime}><i class="fa-solid fa-rotate-right"></i></button>
      </div>
      <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
    </div>
  )
}

export default App;
