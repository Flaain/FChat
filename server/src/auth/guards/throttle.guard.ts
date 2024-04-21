// import { ThrottlerGuard } from "@nestjs/throttler";

// export class ThrottleAuthGuard extends ThrottlerGuard {
//     constructor() {
//         super({ throttlers: [
//             {
//                 name: 'short',
//                 ttl: 10000,
//                 limit: 3,
//             },
//             {
//                 name: 'medium',
//                 ttl: 10000,
//                 limit: 20,
//             },
//             {
//                 name: 'long',
//                 ttl: 60000,
//                 limit: 100,
//             },
//         ] });
//     }
// }