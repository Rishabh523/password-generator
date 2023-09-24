const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
let symbols="!@#$%^&*()_-+/*~`,.:'{}[]|\?<>;";
// console.log(lowercaseCheck);
let password= "";
let checkCount=0;
let passwordLength=10;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

// set password length
function handleSlider() {
 inputSlider.value = passwordLength;
 lengthDisplay.innerText = passwordLength;
 //or kuch karna chahiye
const min=inputSlider.min;
const max=inputSlider.max;
inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"; 
   
}


function  setIndicator(color) {
   indicator.style.backgroundColor=color;
   //shadow
   indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//get the rnd integer
function getRandomInteger(min,max) {
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber() {
    return getRandomInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97,122));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbol() {
    let randomind=getRandomInteger(0,symbols.length);
    return symbols.charAt(randomind);
}

function calcStrength() {
    let hasupper=false;
    let haslower=false;
    let hasnumber=false;
    let hassymbol=false;
    if(uppercaseCheck.checked)
    hasupper=true;
    if(lowercaseCheck.checked)
    haslower=true;
    if(numbersCheck.checked)
    hasnumber=true;
    if(symbolCheck.checked)
    hassymbol=true;
    if(haslower && hasupper && (hasnumber || hassymbol) && passwordLength>=8)
    { setIndicator("#0F0");
    }
    else if((haslower || hasupper) && (hasnumber || hassymbol) && passwordLength>=6)
    { setIndicator("#ff0");
    }
    else
    { setIndicator("#f00");
    }
     
}


async function copyContent() {
    try {
        await navigator.clipboard.writeText("PasswordDisplay.value");
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");

    setTimeout(()=> {
         copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength=e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', ()=> {
    if(passwordDisplay.value)
    copyContent();
})

function handlecheckboxChange() {
    checkCount=0;
  allCheckbox.forEach((checkbox) => {
    if(checkbox.checked)
    checkCount++;
  });

  //special condition
  if(passwordLength<checkCount)
  {passwordLength=checkCount;
    handleSlider();
  }
}
function shufflePassword(array) {
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--)
    {   //random index finding
        const j=Math.floor(Math.random()*(i+1));
        //swap number at i and j index
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => {str+=el;});
    return str;
}


allCheckbox.forEach((checkbox)=>{  
    checkbox.addEventListener('change',handlecheckboxChange);
});


generateBtn.addEventListener('click', () =>{
   
   //none of the checkbox is selected
    if(checkCount ==0){
        return;
    }
   if(passwordLength<checkCount){
   passwordLength=checkCount;
   handleSlider();
   }

   //let's start the journey to find the new password
   
   //remove old password
   console.log("starting the journey")
   password="";

   //let's put the stuff mentioned by checkboxes
//    if(uppercaseCheck.checked){
//     password+=generateUpperCase();
//    }
//    if(lowercaseCheck.checked){
//     password+=generateLowerCase();
//    }
//    if(numbersCheck.checked){
//     password+=generateRandomNumber();
//    }
//    if(symbolCheck.checked){
//     password+=generateSymbol();
//    }

   let funcArr=[];
   if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
   }
   if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
   }
   if(numbersCheck.checked){
    funcArr.push(generateRandomNumber);
   }
   if(symbolCheck.checked){
    funcArr.push(generateSymbol);
   }

   //compulsory addition
   for(let i=0;i<funcArr.length;i++){
     password+=funcArr[i]();     
   }

   //remaining addition
   for(let i=0; i<passwordLength-funcArr.length;i++)
   {
    let randomindex=getRandomInteger(0,funcArr.length);
    console.log("randomInd"+randomindex);
    password+=funcArr[randomindex]();
   }

   //suffle the password
   password=shufflePassword(Array.from(password));

   //show in UI
   passwordDisplay.value=password;

   //calculate strength
   calcStrength();
});
