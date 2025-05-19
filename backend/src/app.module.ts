import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { MedicineModule } from './medicine/medicine.module';
import { ValidationPipe } from '@nestjs/common';
import { MedicineModule as MedicieModule } from './medicine/medicine.module';


// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/mydb',
        dbName: 'PhytovierPharma',
      }),
      inject: [ConfigService],
    }),
    MedicineModule,
    MedicieModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}