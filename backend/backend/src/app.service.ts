import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHealth() {
        return {
            status: 'OK',
            message: 'PDF Reports Manager API is running',
            timestamp: new Date().toISOString(),
        };
    }
}
