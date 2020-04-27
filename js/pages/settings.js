import { showAnimation, hideAnimation, getMyData, allStates } from "../shared.js";

export const renderSettingsPage = async () => {
    showAnimation();
    const myData = await getMyData();
    let template = '<h3>Settings</h3>'
    if(myData.code === 200 && myData.data.RcrtUP_Submitted_v1r0 !== undefined && myData.data.RcrtUP_Submitted_v1r0 === 1){
        const userData = myData.data;
        template += `
            <div class="row settings-header">
                <div class="col"><h4>User profile</h4></div>
                <div class="ml-auto"><i title="Edit user profile" id="editUserProfile" class="fas fa-edit"></i></div>
            </div>
            <div class="row">
                <div class="col data">First name</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_Fname_v1r0}"></div>
            </div>
            <div class="row">
                <div class="col data">Middle initial</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_Minitial_v1r0 ? ` ${userData.RcrtUP_Minitial_v1r0}` :''}"></div>
            </div>
            <div class="row">
                <div class="col data">Last name</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_Lname_v1r0}"></div>
            </div>
            <div class="row"><div class="col"><h5>Date of Birth</h5></div></div>
            <div class="row">
                <div class="col data">Month</div>
                <div class="col">
                    <select class="form-control" disabled required id="UPMonth">
                        <option value="">-- Select Month --</option>
                        <option value="01" ${userData.RcrtUP_MOB_v1r0 === '01' ? 'selected' : ''}>JAN</option>
                        <option value="02" ${userData.RcrtUP_MOB_v1r0 === '02' ? 'selected' : ''}>FEB</option>
                        <option value="03" ${userData.RcrtUP_MOB_v1r0 === '03' ? 'selected' : ''}>MAR</option>
                        <option value="04" ${userData.RcrtUP_MOB_v1r0 === '04' ? 'selected' : ''}>APR</option>
                        <option value="05" ${userData.RcrtUP_MOB_v1r0 === '05' ? 'selected' : ''}>MAY</option>
                        <option value="06" ${userData.RcrtUP_MOB_v1r0 === '06' ? 'selected' : ''}>JUN</option>
                        <option value="07" ${userData.RcrtUP_MOB_v1r0 === '07' ? 'selected' : ''}>JUL</option>
                        <option value="08" ${userData.RcrtUP_MOB_v1r0 === '08' ? 'selected' : ''}>AUG</option>
                        <option value="09" ${userData.RcrtUP_MOB_v1r0 === '09' ? 'selected' : ''}>SEP</option>
                        <option value="10" ${userData.RcrtUP_MOB_v1r0 === '10' ? 'selected' : ''}>OCT</option>
                        <option value="11" ${userData.RcrtUP_MOB_v1r0 === '11' ? 'selected' : ''}>NOV</option>
                        <option value="12" ${userData.RcrtUP_MOB_v1r0 === '12' ? 'selected' : ''}>DEC</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col data">Day</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_BD_v1r0}"></div>
            </div>
            <div class="row">
                <div class="col data">Year</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_YOB_v1r0}"></div>
            </div>
            </br>
            <div class="row">
                <div class="col data">Email</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_Email1_v1r0}"></div>
            </div>
            <div class="row">
                <div class="col data">Phone no.</div>
                <div class="col"><input class="form-control" readonly value="${userData.RcrtUP_Phone1_v1r0 ? userData.RcrtUP_Phone1_v1r0 : ''}"></div>
            </div>
            <div class="row">
                <div class="col data">Address</div>
                <div class="col">
                    ${userData.RcrtUP_AddressLn1_v1r0} ${userData.RcrtUP_AddressLn2_v1r0 ? userData.RcrtUP_AddressLn2_v1r0 : ''}</br>
                    ${userData.RcrtUP_City_v1r0} ${Object.keys(allStates)[Object.values(allStates).indexOf(parseInt(userData.RcrtUP_State_v1r0))]}
                </div>
            </div>
        `;
    }
    else {
        template += 'Settings not available';
    }
    document.getElementById('root').innerHTML = template;
    hideAnimation();
    addEventEditUP(userData);
}

const addEventEditUP = (data) => {
    const editUserProfile = document.getElementById('editUserProfile');
    if(editUserProfile){
        editUserProfile.addEventListener('click', () => {

        });
    }
}