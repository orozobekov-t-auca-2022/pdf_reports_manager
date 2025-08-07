import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Folder, File } from './models';
import { FolderController } from './controllers/folder/folder.controller';
import { FileController } from './controllers/file/file.controller';
import { FolderService } from './service/folder/folder.service';
import { FileService } from './service/file/file.service';
import { SeedService } from './services/seed.service';

@Module({
    controllers: [AppController, FolderController, FileController],
    providers: [AppService, FolderService, FileService, SeedService],
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: 'db',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'nestjs_app',
            models: [Folder, File],
            autoLoadModels: true,
            synchronize: true,
        }),
        SequelizeModule.forFeature([Folder, File]),
    ]
})

export class AppModule {}