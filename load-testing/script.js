import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { tagWithCurrentStageIndex, tagWithCurrentStageProfile } from 'https://jslib.k6.io/k6-utils/1.3.0/index.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE_URL = 'https://test-api.k6.io';
const USERNAME = 'TestUser';
const PASSWORD = 'SuperCroc2020';

export default function () {
    // all the requests are tagged with a `stage` tag
    // with the index and profile of the stage as value
    tagWithCurrentStageIndex(); //{stage: "1"}
    tagWithCurrentStageProfile(); //{stage_profile: ramp-up}

    group("load testing", function () {
        var authHeaders = null;

        group("login", function () {
            authHeaders = login(USERNAME);
        });

        sleep(1);
        
        group("get crocodiles", function () {
            getCrocodiles(authHeaders);
        });
    });   
}

export function login(userName) {
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: userName,
        password: PASSWORD,
    });

    check(loginRes, {
        'logged in successfully': (resp) => resp.json('access') !== '',
    });

    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginRes.json('access')}`
        }
    }
}

export function getCrocodiles(authHeaders) {
    var result = http.get(`${BASE_URL}/my/crocodiles/`, authHeaders);

    check(result, { 'status was 200': (r) => r.status == 200 });
    var responseObjects = result.json();
    check(responseObjects,
        { 'retrieved crocodiles': (responseObject) => responseObject.length > 0 });
}


export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: '→', enableColors: true }),
        'test_results_summary.json': JSON.stringify(data)
    };
}

