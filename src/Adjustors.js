import React from 'react';

export default function Adjustors(props){
    return(
      <div>
        <h3 id={props.id}>{props.title}</h3>
        <div className="time-sets">
          <button id={props.type + '-decrement'} onClick={()=>props.changeTime(-60,props.type)}><i class="fa-solid fa-circle-minus"></i></button>
          <h3 id={props.title}>{props.time/60}</h3>
          <button id={props.type + '-increment'} onClick={()=>props.changeTime(60,props.type)}><i class="fa-solid fa-circle-plus"></i></button>
        </div>
      </div>
    )
  }