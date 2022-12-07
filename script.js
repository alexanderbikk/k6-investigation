import http from 'k6/http';
import { check, sleep } from 'k6';

// simple options
// export const options = {
//     vus: 10,
//     duration: '10s',
// };

//stages shortcut
export const options = {
    stages: [
        {
            "duration": "5s",
            "target": 10
        },
        {
            "duration": "10s",
            "target": 20
        },
        {
            "duration": "5s",
            "target": 2
        }
    ]
}

export default function () {
    const res = http.get('https://httpbin.test.k6.io/');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
}
