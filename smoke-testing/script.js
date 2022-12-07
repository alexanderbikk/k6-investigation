import { check, sleep, group } from 'k6';
import http from 'k6/http';
import { SharedArray } from 'k6/data';
import { vu } from 'k6/execution';

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.1.0/index.js";


const BASE_URL = 'https://test-api.k6.io';
const PASSWORD = 'superCroc2019';

// one shared array for all vus
const crocodiles = new SharedArray('crocodiles', function () {
    return JSON.parse(open('./input_data.json'));
});


export function setup() {
    //one user per test. up to 100 crocodiels
    var userName = `usert${randomIntBetween(1, 100000000)}@example.com`;
    createUser(userName);
    return userName;
}

export default (data) => {
    var userName = data;

    var index = (vu.idInTest - 1) % 5;    
    var crocodile =  crocodiles[index];

    console.log(`user name: ${userName}, vu number: ${vu.idInTest}`);
    console.log(`crocodile name: ${crocodile.name}`);

    group("crocodile crud", function () {
        var authHeaders = null;

        group("login", function () {
            authHeaders = login(userName);
        });

        sleep(1);

        var crocodileId = null;
        group("create crocodile", function () {
            crocodileId = createCrocodile(crocodile, authHeaders);
        });

        sleep(1);

        group("update crocodile", function () {
            updateCrocodile(crocodileId, authHeaders);
        });

        sleep(1);

        group("delete crocodile", function () {
            deleteCrocodile(crocodileId, authHeaders);
        });
    });
};

export function createUser(userName) {
    var user = {
        first_name: 'Crocodile',
        last_name: 'Owner',
        username: userName,
        password: PASSWORD,
    }

    var result = http.post(`${BASE_URL}/user/register/`, user);
    //console.log(`${result.status}`);
    check(result, { "user created ": (r) => r.status == 201 });

    console.log(`${userName}`);
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

export function createCrocodile(crocodile, authHeaders) {   
    var result = http.post(`${BASE_URL}/my/crocodiles/`, JSON.stringify(crocodile), authHeaders);
    //console.log(`${result.status}`);
    check(result, { 'crocodile created': (r) => r.status == 201 });

    var id = result.json('id');
    console.log(`crocodile id: ${id}`);
    return id;
}

export function updateCrocodile(crocodileId, authHeaders) {
    let payload = {
        name: `New Croc Test2`
    };

    var result = http.patch(`${BASE_URL}/my/crocodiles/${crocodileId}/`, JSON.stringify(payload), authHeaders);
    //console.log(`${result.status}`);
    check(result, { 'crocodile patched': (r) => r.status == 200 });

    var responseObject = result.json();
    check(responseObject, { 'name updated': (r) => r.name == `New Croc Test2` });
}
export function deleteCrocodile(crocodileId, authHeaders) {
    var result = http.del(`${BASE_URL}/my/crocodiles/${crocodileId}/`, null, authHeaders);
    //console.log(`${result.status}`);
    check(result, { 'crocodile deleted': (r) => r.status == 204 });
}


export function handleSummary(data) {
    return {
        stdout: textSummary(data, { indent: '→', enableColors: true }),
        'test_results_summary.json': JSON.stringify(data)
    };
}

