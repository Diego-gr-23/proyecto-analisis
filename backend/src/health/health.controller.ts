import { Controller, Get } from '@nestjs/common';
import {Connection} from 'mongoose';
import {InjectConnection} from '@nestjs/mongoose';

@Controller('health')
export class HealthController {
    constructor(@InjectConnection() private readonly connection: Connection) {}
    @Get()
    checkDB(){
        return{
            status: 'API is running',
            dbStatus: this.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        };
    }

}
