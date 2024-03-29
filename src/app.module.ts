import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { join } from 'path';

import { ProjectsModule } from './modules/projects/projects.module';
import { Project } from './modules/projects/models/projects.model';
import { CategoriesModule } from './modules/categories/categories.module';
import { Category } from './modules/categories/models/categories.model';
import { ExpertsModule } from './modules/experts/experts.module';
import { Expert } from './modules/experts/models/experts.model';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { Service } from './modules/services/models/services.model';
import { ContactsModule } from './modules/contacts/contacts.module';
import { Contact } from './modules/contacts/models/contacts.model';
import { ParametersModule } from './modules/parameters/parameters.module';
import { Parameter } from './modules/parameters/models/parameters.model';
import { ContactExpert } from './modules/contacts/models/contact-expert.model';
import { ParameterExpert } from './modules/parameters/models/parameter-expert.model';
import { ParameterExpertTranslation } from './modules/parameters/models/parameter-expert-translations.model';
import { FilesModule } from './common/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CallsSocketsModule } from './sockets/calls-socket/calls-sockets.module';
import { CallsModule } from './modules/calls/calls.module';
import { PaginateModule } from 'nestjs-sequelize-paginate';
import { User } from './modules/users/models/user.model';
import { UsersModule } from './modules/users/users.module';
import { Collection } from './modules/collections/models/collection.model';
import { CollectionTranslation } from './modules/collections/models/collection_translations.model';
import { CollectionsModule } from './modules/collections/collections.module';
import { Language } from './modules/languages/models/languages.model';
import { LanguagesModule } from './modules/languages/languages.module';
import { CategoryTranslation } from './modules/categories/models/categories_translations.model';
import { ServiceTranslation } from './modules/services/models/services-translations.model';
import { ExpertTranslation } from './modules/experts/models/experts-translations.model';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { Schedule } from './modules/schedule/models/schedules.model';
import { Appointment } from './modules/schedule/models/appointments.model';
import { ScheduleTemplate } from './modules/schedule/models/schedule-templates.model';
import { AppointmentReservation } from './modules/schedule/models/appointment-reservations.model';
import { MailerModule } from '@nestjs-modules/mailer';
import { Room } from './modules/calls/models/rooms.model';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupervisorNotifications } from './modules/notifications/models/supervisor-notifications.model';
import { ExpertCategory } from './modules/categories/models/expert-categories.model';
import { Seller } from './modules/sellers/models/sellers.model';
import { SellersModule } from './modules/sellers/sellers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/models/orders.model';

@Module({
  imports: [
    PaginateModule.forRoot({
      url: 'http://localhost:5000',
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDGRID_HOST,
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS,
        },
      },
      template: {
        dir: join(__dirname, 'common/mail/templates'),
        adapter: new HandlebarsAdapter(),
      },
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: true,
      models: [
        Project,
        Category,
        CategoryTranslation,
        Expert,
        ExpertTranslation,
        ExpertCategory,
        Service,
        ServiceTranslation,
        Contact,
        ContactExpert,
        Parameter,
        ParameterExpert,
        ParameterExpertTranslation,
        User,
        Collection,
        CollectionTranslation,
        Language,
        Schedule,
        ScheduleTemplate,
        Appointment,
        AppointmentReservation,
        Room,
        SupervisorNotifications,
        Seller,
        Order,
      ],
    }),
    ProjectsModule,
    CategoriesModule,
    ExpertsModule,
    AuthModule,
    ServicesModule,
    ContactsModule,
    ParametersModule,
    FilesModule,
    CallsModule,
    CallsSocketsModule,
    UsersModule,
    CollectionsModule,
    LanguagesModule,
    ScheduleModule,
    NotificationsModule,
    SellersModule,
    PaymentsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
