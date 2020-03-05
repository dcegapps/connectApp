import { storeResponse, getParameters, validateToken, userLoggedIn, dataSavingBtn, getMyData, dateTime, showAnimation, hideAnimation } from "./js/shared.js";
import { userNavBar, homeNavBar } from "./js/components/navbar.js";
import { homePage, joinNowBtn } from "./js/pages/homePage.js";
import { signIn } from "./js/pages/signIn.js";
import { firebaseConfig } from "./js/config.js";
import { consentTemplate, initializeCanvas, addEventConsentSubmit } from "./js/pages/consent.js";
import { addEventsConsentSign, addEventHealthCareProviderSubmit, addEventHeardAboutStudy, addEventSaveConsentBtn, addEventRequestPINForm } from "./js/event.js";
import { renderUserProfile } from "./js/components/form.js";
import { questionnaire, blockParticipant } from "./js/pages/questionnaire.js";
import { healthCareProvider, heardAboutStudy, requestPINTemplate } from "./js/pages/healthCareProvider.js";

let auth = '';

window.onload = function() {
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(isIE) {
        const mainContent = document.getElementById('root');
        mainContent.innerHTML = `<span class="not-compatible">Connect web application is not compatible with Internet Explorer, please use Chrome, Safari, Firefox or Edge.</span>`;
    }
    const config = firebaseConfig();
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    auth = firebase.auth();
    router();
    main();
}

const handleVerifyEmail = (auth, actionCode) => {
    auth.applyActionCode(actionCode).then(function(resp) {
        window.location.hash = '#user';
        location.reload();
    }).catch(function(error) {
        console.log(error);
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
    });
}

function handleResetPassword(auth, actionCode) {
    auth.verifyPasswordResetCode(actionCode).then(function(email) {
        
        document.getElementById('root').innerHTML = `
            Reset password for <strong>${email}</strong>
            <form id="resetPasswordForm" method="POST">
                <div class="form-group row">
                    <label class="col-sm-3 col-form-label">Enter new password: -</label>
                    <input type="password" id="resetPassword" pattern="[A-Za-z0-9]{6,}" title="Strong passwords have at least 6 characters and a mix of letters and numbers" class="form-control col-sm-4">
                </div>
                <div class="form-group">
                    <input type="checkbox" id="showPassword">Show Password
                </div>
                <button type="submit" class="btn btn-primary">Update password</button>
            </form>
        `;
        const form = document.getElementById('resetPasswordForm');

        const show = document.getElementById('showPassword');
        show.addEventListener('click', () => {
            const element = document.getElementById('resetPassword');
            if(element.type === 'password') element.type = 'text';
            else element.type = 'password';
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            const newPassword = document.getElementById('resetPassword').value;
            if(!newPassword) return;
            if(newPassword.trim() === '') return;
            // Save the new password.
            auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
                document.getElementById('root').innerHTML = `
                    Password reset successfully! Please <a href="#sign_in">sign in</a> again to continue.
                `;
                auth.signInWithEmailAndPassword(accountEmail, newPassword);
            }).catch(function(error) {
                // Error occurred during confirmation. The code might have expired or the
                // password is too weak.
            });
        })
        
    }).catch(function(error) {
      // Invalid or expired action code. Ask user to try to reset the password
      // again.
    });
}

window.onhashchange = () => {
    const parameters = getParameters(window.location.href);
    if(parameters && parameters['mode']){
        const mode = parameters['mode'];
        const actionCode = parameters['oobCode'];
        switch (mode) {
          case 'resetPassword':
            handleResetPassword(auth, actionCode);
            break;
        //   case 'recoverEmail':
            // Display email recovery handler and UI.
            // handleRecoverEmail(auth, actionCode, lang);
            // break;
            case 'verifyEmail':
            handleVerifyEmail(auth, actionCode);
            break;
            default:
            // Error: invalid mode.
        }
    }
    
    document.getElementById('navbarNavAltMarkup').classList.remove('show');
    router();
}

const main = () => {
    if('serviceWorker' in navigator){
        try {
            navigator.serviceWorker.register('./serviceWorker.js');
        }
        catch (error) {
            console.log(error);
        }
    }
}

const router = async () => {
    const parameters = getParameters(window.location.href);
    if(parameters && parameters.token && await userLoggedIn() === false){
        window.location.hash = '#sign_in';
    }
    toggleNavBar();
    const route =  window.location.hash || '#';
    if(route === '#') homePage();
    else if (route === '#sign_in' && await userLoggedIn() === false) signIn();
    else if (route === '#user') userProfile();
    else if (route === '#sign_out') signOut();
    else window.location.hash = '#';
}

const userProfile = () => {
    auth.onAuthStateChanged(async user => {
        if(user){
            const mainContent = document.getElementById('root');
            const parameters = getParameters(window.location.href);
            showAnimation();
            if(user.email && !user.emailVerified){
                const mainContent = document.getElementById('root');
                mainContent.innerHTML = '<div>Please verify your email by clicking <a id="verifyEmail"><button class="btn btn-primary">Verify Email</button></a></div>'

                document.getElementById('verifyEmail').addEventListener('click', () => {
                    mainContent.innerHTML = `<div>Please click on the verification link you will receive on <strong>${user.email}</strong></div>` 
                });
                hideAnimation();
                document.getElementById('verifyEmail').addEventListener('click', () => {
                    user.sendEmailVerification().then(function() {
                        
                    }).catch(function(error) {
                        
                    });
                });
                return;
            }
            
            if(parameters && parameters.token){
                const response = await validateToken(parameters.token);
                if(response.code === 200) {
                    // await storeResponse({RcrtSI_Account_v1r0: 1, RcrtSI_AccountTime_v1r0: });
                }
            }
            window.history.replaceState({},'', './#user');
            const myData = await getMyData();
            
            if(myData.code === 200){
                if(myData.data.RcrtES_Site_v1r0 && myData.data.RcrtES_Aware_v1r0){
                    if(myData.data.RcrtCS_Consented_v1r0 === 1){
                        if(myData.data.RcrtUP_Fname_v1r0 && myData.data.RcrtSI_RecruitType_v1r0 && myData.data.RcrtSI_RecruitType_v1r0 === 2){
                            blockParticipant();
                            hideAnimation();
                            return;
                        }
                        if(myData.data.RcrtUP_Fname_v1r0){
                            questionnaire();
                            hideAnimation();
                            return;
                        }
                        renderUserProfile();
                        hideAnimation();
                        return;
                    }
                    mainContent.innerHTML = consentTemplate();
                    initializeCanvas();
                    // addEventSaveConsentBtn();
                    addEventsConsentSign();

                    addEventConsentSubmit();
                    hideAnimation();
                    return;
                }
                else if(myData.data.RcrtES_Site_v1r0 && !myData.data.RcrtES_Aware_v1r0){
                    mainContent.innerHTML =  heardAboutStudy();
                    addEventHeardAboutStudy();
                    hideAnimation();
                }
                else if(myData.RcrtES_PIN_v1r0){
                    mainContent.innerHTML = requestPINTemplate();
                    addEventRequestPINForm(user.metadata.a);
                    hideAnimation();
                }
                else{
                    mainContent.innerHTML = healthCareProvider();
                    addEventHealthCareProviderSubmit();
                    hideAnimation();
                }
            }
            else {
                mainContent.innerHTML = requestPINTemplate();
                addEventRequestPINForm(user.metadata.a);
                hideAnimation();
            }
        }
        else{
            window.location.hash = '#';
        }
    });
}

const signOut = () => {
    firebase.auth().signOut();
    window.location.hash = '#';
}

const toggleNavBar = () => {
    auth.onAuthStateChanged(user => {
        if(user){
            document.getElementById('navbarNavAltMarkup').innerHTML = userNavBar();
            document.getElementById('joinNow') ? document.getElementById('joinNow').innerHTML = joinNowBtn(false) : ``;
        }
        else{
            document.getElementById('navbarNavAltMarkup').innerHTML = homeNavBar();
            document.getElementById('joinNow') ? document.getElementById('joinNow').innerHTML = joinNowBtn(true) : ``;
        }
    });
}

const removeActiveClass = (className, activeClass) => {
    let fileIconElement = document.getElementsByClassName(className);
    Array.from(fileIconElement).forEach(elm => {
        elm.classList.remove(activeClass);
    });
}
