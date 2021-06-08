import { hideAnimation, questionnaireModules } from "../shared.js";
import { blockParticipant, questionnaire } from "./questionnaire.js";
import { renderUserProfile } from "../components/form.js";
import { consentTemplate, initializeCanvas, addEventConsentSubmit } from "./consent.js";
import { addEventsConsentSign, addEventHeardAboutStudy, addEventRequestPINForm, addEventHealthCareProviderSubmit, addEventPinAutoUpperCase } from "../event.js";
import { heardAboutStudy, requestPINTemplate, healthCareProvider } from "./healthCareProvider.js";

export const myToDoList = (data) => {
    const mainContent = document.getElementById('root');
    if(data['827220437'] && data['142654897']){
        localStorage.eligibilityQuestionnaire = JSON.stringify({'827220437': data['827220437']})
        if(data['919254129'] === 353358909){
            if(data['699625233'] && data['699625233'] === 353358909 && data['512820379'] && data['512820379'] === 854703046){
                blockParticipant();
                hideAnimation();
                return;
            }
            if(data['699625233'] && data['699625233'] === 353358909){
                let template = '<h3>My To Do List: </h3>';
                template += `<span>You have self assessment questionnaires ready to take</span>
                <ul class="questionnaire-module-list">`;
                const modules = questionnaireModules;
                if (data.Module1 && data.Module1.COMPLETED) { modules["Enter SSN"].enabled = true};
                if (data.ModuleSsn && data.ModuleSsn.COMPLETED) { modules["Medications, Reproductive Health, Exercise, and Sleep"].enabled = true};
                if (data.Module2 && data.Module2.COMPLETED) { modules["Smoking, Alcohol, and Sun Exposure"].enabled = true};
                if (data.Module3 && data.Module3.COMPLETED) { modules["Where You Live and Work"].enabled = true};
                for(let key in modules){
                    template += `<li class="list-item">
                                    <button class="btn list-item-active btn-agreement questionnaire-module ${modules[key].enabled ? '' : 'btn-disbaled'}" title="${key}" module_id="${modules[key].moduleId}" data-module-url="${modules[key].url ? modules[key].url : ''}">${key}</button>
                                </li>`;
                }
                template += `</ul>`

                // template += `
                //     <span>You have self assessment questionnaires ready to take</span>
                //     <ul class="questionnaire-module-list">
                //         <li class="list-item">
                //             <button class="btn list-item-active btn-agreement" title="Module 1" id="module1">Module 1</button>
                //         </li>
                //         <li class="list-item">
                //             <button class="btn list-item-active  btn-agreement" title="Module 2" id="module2">Module 2</button>
                //         </li>
                //         <li class="list-item">
                //             <button class="btn list-item-active btn-disbaled btn-agreement" title="Module 3" id="module3">Module 3</button>
                //         </li>
                //         <li class="list-item">
                //             <button class="btn list-item-active btn-disbaled btn-agreement" title="Module 4" id="module4">Module 4</button>
                //         </li>
                //     </ul>
                // `;
                mainContent.innerHTML = template;
                addEventToDoList();
                hideAnimation();
                return;
            }
            renderUserProfile();
            hideAnimation();
            return;
        }
        //mainContent.innerHTML = consentTemplate();
        consentTemplate();
        
        //initializeCanvas();
        //addEventsConsentSign();

        //addEventConsentSubmit();
        hideAnimation();
        return;
    }
    else if(data['827220437'] && !data['142654897']){
        mainContent.innerHTML =  heardAboutStudy();
        addEventHeardAboutStudy();
        hideAnimation();
    }
    else if(data['379080287']){
        mainContent.innerHTML = requestPINTemplate();
        addEventPinAutoUpperCase();
        addEventRequestPINForm(user.metadata.a);
        hideAnimation();
    }
    else{
        mainContent.innerHTML = healthCareProvider();
        addEventHealthCareProviderSubmit();
        hideAnimation();
    }
}

const addEventToDoList = () => {
    const modules = document.getElementsByClassName('questionnaire-module');
    Array.from(modules).forEach(module => {
        module.addEventListener('click',() => {
            if (!module.classList.contains("btn-disbaled")){
                const url = module.dataset.moduleUrl;
                const moduleId = module.getAttribute("module_id");
                if(url) questionnaire(url, moduleId);
            }

        })
    })
}
