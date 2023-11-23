import React, { useState } from 'react';
import styles from '../styles/mcq.module.css';

function randomOrderGenerator(count) {
  let initial = [];
  for (let i = 0; i < count; i++) {
    initial.push(i);
  }

  let num = [];
  while (initial.length > 0) {
    let rand = Math.floor(Math.random() * initial.length);
    num.push(initial[rand]);
    initial.splice(rand, 1);
  }
  return num;
}

function CreateMCQ({ position, question, options, quesStatus, setQuesStatus }) {
  for(let x=0;x<options.length;x++){
    if(options[x].indexOf('(Correct)')!=-1){
      options[x]=options[x].substring(0,options[x].indexOf('(Correct)'));
      if(x!=0){
        let temp=options[0];
        options[0]=options[x];
        options[x]=temp;
      }
    }
  }
  const [optionsOrder,setOptionOrder] = useState(randomOrderGenerator(4));


  

  function choseOption(e,optionNumber) {
    if(quesStatus[position]!='listed') return console.log('Found '+quesStatus[position]);
    if (optionNumber === 0) {
      setQuesStatus((prevStatus) => {
        prevStatus[position] = 'right';
        return { ...prevStatus };
      });
    } else {
      setQuesStatus((prevStatus) => {
        prevStatus[position] = 'wrong';
        let childN=e.target.parentNode.childNodes;
        childN.forEach((child=>{
            child.style.border="4px solid rgba(255, 48, 69, 0.6)";
            child.style.backgroundColor= "rgba(255,25,25, 0.2)"
        }))
        return { ...prevStatus };
      });
    }
  }

  return (
    <div className={styles.modal} key={position}>
      <div className={styles.questionSection}>
        <div className={styles.questionNumber}>Q {position}</div>
        <div className={styles.question}>{question}</div>
      </div>
      <div className={styles.answersArea}>
        {optionsOrder.map((optionIndex, visibleIndex) => (
          <div
            className={`${styles.optionsSection} `}
            key={visibleIndex}
          >
            <div
              className={`${styles.optionNumber} ${
                quesStatus[position] !== 'listed' && optionIndex==0? styles.correctOption : ''
              }`}
              onClick={(e) => choseOption(e,optionIndex)}
            >
              {['A', 'B', 'C', 'D'][visibleIndex]}
            </div>
            <div className={`${styles.option} ${
                quesStatus[position] !== 'listed' && optionIndex==0 ? styles.correctOption : ''
              }`} onClick={(e) => choseOption(e,optionIndex)}>
              {options[optionIndex]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateMCQ;