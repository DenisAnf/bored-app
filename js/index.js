const body = document.body;
const questionNode = document.querySelector(".js-question");
const ideaNode = document.querySelector(".js-idea");
const buttonShowIdea = document.querySelector(".js-button-go");

const QUESTION_INITION_VALUE = "🤔 Стало скучно?";
const ANSWER_INITION_VALUE = "Ура, теперь не скучно 🔥";
const IDEA_INITION_VALUE = "Найти, чем заняться?";
const IDEA_FOR_LOAD_TIME_VALUE = "Загрузка идеи...";
const BACKGROUND_WITHOUT_IDEA =
   "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.20) 47.62%)";
const BACKGROUND_WITH_IDEA =
   "linear-gradient(180deg, rgba(0, 176, 28, 0.20) 24.48%, rgba(255, 255, 255, 0.00) 100%)";
const apiActivityLink = "https://www.boredapi.com/api/activity/";

const init = () => {
   body.style.background = BACKGROUND_WITHOUT_IDEA;
   questionNode.textContent = QUESTION_INITION_VALUE;
   ideaNode.textContent = IDEA_INITION_VALUE;
};
init();

const disableButton = () => (buttonShowIdea.disabled = true);

const activeButton = () => (buttonShowIdea.disabled = false);

const getActivity = () => {
   disableButton();
   //body.style.background = BACKGROUND_WITHOUT_IDEA;
   ideaNode.textContent = IDEA_FOR_LOAD_TIME_VALUE;

   fetch(apiActivityLink)
      .then((response) => {
         if (!response.ok) {
            ideaNode.textContent = `Ошибка загрузки идеи из API: ${response.status}`;
            activeButton();
         }
         return response.json();
      })

      .then((data) => {
         const idea = data.activity;
         if (typeof idea !== "string") {
            ideaNode.textContent = "Почему-то API вернул не строку...";
            activeButton();
            return;
         }
         translate(idea);
         console.log(idea);
      })

      .catch((error) => {
         ideaNode.textContent = `Ошибка API activity: ${error.message}`;
         activeButton();
      });
};

const apiTranslateLink =
   "https://translated-mymemory---translation-memory.p.rapidapi.com/get";
const apiKey = "9ffd4a8b32mshe8145e4c83e463bp1d5e15jsnfaa3c9332f3f";

async function translate(textToTranslate) {
   if (textToTranslate === "") {
      ideaNode.textContent = `А идеи то нет...`;
      return;
   }

   const options = {
      method: "GET",
      headers: {
         //"Accept-Encoding": "application/json",
         "X-RapidAPI-Key": apiKey,
         "X-RapidAPI-Host":
            "translated-mymemory---translation-memory.p.rapidapi.com",
      },
   };

   const queryParams = new URLSearchParams({
      langpair: "en|ru",
      q: textToTranslate,
   });

   try {
      const response = await fetch(
         `${apiTranslateLink}?${queryParams}`,
         options
      );

      if (!response.ok) {
         ideaNode.textContent = `${textToTranslate} Ошибка загрузки перевода из API: ${response.status}`;
      }

      const result = await response.json();
      const translatedText = result.matches[0].translation;
      ideaNode.textContent = translatedText;
      questionNode.textContent = ANSWER_INITION_VALUE;
      body.style.background = BACKGROUND_WITH_IDEA;
      activeButton();
   } catch (error) {
      ideaNode.textContent = textToTranslate + " (Перевод не удался)";
      questionNode.textContent = ANSWER_INITION_VALUE;
      body.style.background = BACKGROUND_WITH_IDEA;
      activeButton();
   }
}

buttonShowIdea.addEventListener("click", getActivity);
