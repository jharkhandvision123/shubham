const questions = [
{
question:"Who is known as the Father of Political Science?",
options:["Plato","Aristotle","Locke","Rousseau"],
answer:1
},
{
question:"Which book was written by Plato?",
options:["Politics","Republic","Leviathan","Social Contract"],
answer:1
},
{
question:"Who wrote 'Politics'?",
options:["Aristotle","Plato","Hobbes","Marx"],
answer:0
},
{
question:"India is a?",
options:["Monarchy","Dictatorship","Democratic Republic","Federation without Constitution"],
answer:2
},
{
question:"The Constitution of India came into force on?",
options:["15 August 1947","26 January 1950","26 November 1949","2 October 1950"],
answer:1
},
{
question:"How many Fundamental Rights are there at present?",
options:["5","6","7","8"],
answer:1
},
{
question:"Who is the head of the Indian State?",
options:["Prime Minister","President","Chief Justice","Governor"],
answer:1
},
{
question:"Which is the lower house of Parliament?",
options:["Rajya Sabha","Lok Sabha","Vidhan Sabha","Legislative Council"],
answer:1
},
{
question:"Universal Adult Franchise means?",
options:["Voting by educated people only","Voting by rich people","Voting by all eligible adults","Voting by government employees"],
answer:2
},
{
question:"Which is the supreme law of India?",
options:["Parliament","Supreme Court","Constitution","President"],
answer:2
}
];

let currentQuestion = 0;
let score = 0;

const questionNumber=document.getElementById("question-number");
const question=document.getElementById("question");
const options=document.getElementById("options");
const nextBtn=document.getElementById("nextBtn");
const submitBtn=document.getElementById("submitBtn");

function loadQuestion(){

questionNumber.innerHTML=`Question ${currentQuestion+1} of ${questions.length}`;

question.innerHTML=questions[currentQuestion].question;

options.innerHTML="";

questions[currentQuestion].options.forEach((opt,index)=>{

options.innerHTML+=`
<label class="option">
<input type="radio" name="answer" value="${index}">
${opt}
</label>
`;

});

if(currentQuestion==questions.length-1){
nextBtn.style.display="none";
submitBtn.style.display="inline-block";
}

}

nextBtn.onclick=function(){

const selected=document.querySelector('input[name="answer"]:checked');

if(!selected){
alert("Please select an answer.");
return;
}

if(Number(selected.value)===questions[currentQuestion].answer){
score++;
}

currentQuestion++;
loadQuestion();

}

submitBtn.onclick=function(){

const selected=document.querySelector('input[name="answer"]:checked');

if(selected && Number(selected.value)===questions[currentQuestion].answer){
score++;
}

document.getElementById("quiz").style.display="none";
document.getElementById("result").style.display="block";

document.getElementById("score").innerHTML=`Score : ${score} / ${questions.length}`;

let percent=(score/questions.length)*100;

document.getElementById("percentage").innerHTML=`Percentage : ${percent}%`;

document.getElementById("status").innerHTML=
percent>=40?"✅ Pass":"❌ Fail";

}

loadQuestion();
