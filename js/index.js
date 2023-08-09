const body = document.body;
const questionNode = document.querySelector('.js-question');
const ideaNode = document.querySelector('.js-idea');
const buttonShowIdea = document.querySelector('.js-button-go');

const QUESTION_INITION_VALUE = '🤔 Стало скучно?';
const ANSWER_INITION_VALUE = 'Ура, теперь не скучно 🔥';
const IDEA_INITION_VALUE = 'Найти, чем заняться?';
const IDEA_FOR_LOAD_TIME_VALUE = 'Загрузка...';
const BACKGROUND_WITHOUT_IDEA = 'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.20) 47.62%)';
const BACKGROUND_WITH_IDEA = 'linear-gradient(180deg, rgba(0, 176, 28, 0.20) 24.48%, rgba(255, 255, 255, 0.00) 100%)';
const ApiLink = "https://www.boredapi.com/api/activity/";


const init = () => {
	body.style.background = BACKGROUND_WITHOUT_IDEA;
	questionNode.textContent = QUESTION_INITION_VALUE;
	ideaNode.textContent = IDEA_INITION_VALUE;
};
init();

const disableButtonHandler = () => buttonShowIdea.disabled = true;

const activeButtonHandler = () => buttonShowIdea.disabled = false;

const getActivity = () => {
	disableButtonHandler();
	//body.style.background = BACKGROUND_WITHOUT_IDEA;
	ideaNode.textContent = IDEA_FOR_LOAD_TIME_VALUE;
	
	fetch(ApiLink)
		
		.then(response => {
			if (!response.ok) {
				ideaNode.textContent = `Ошибка загруprи из API: ${response.status}`;
				activeButtonHandler();
			};
			return response.json();
		})
		
		.then(data => {
			const idea = data.activity;
			if (typeof idea !== 'string') {
				ideaNode.textContent = 'Почему-то API вернул не строку...';
				activeButtonHandler();
				return;
			}
			ideaNode.textContent = idea;
			questionNode.textContent = ANSWER_INITION_VALUE;
			body.style.background = BACKGROUND_WITH_IDEA;
			activeButtonHandler();
		})
	
		.catch(error => {
			ideaNode.textContent = `Ошибка: ${error.message}`;
			activeButtonHandler();
		})
};

buttonShowIdea.addEventListener('click', getActivity);