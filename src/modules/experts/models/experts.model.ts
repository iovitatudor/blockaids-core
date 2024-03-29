import {
  Table,
  BelongsTo,
  Column,
  ForeignKey,
  DataType,
  Model,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/models/projects.model';
import { Category } from '../../categories/models/categories.model';
import { Types } from '../enums/types.enum';
import { Service } from '../../services/models/services.model';
import { ContactExpert } from '../../contacts/models/contact-expert.model';
import { ParameterExpert } from '../../parameters/models/parameter-expert.model';
import { ExpertTranslation } from './experts-translations.model';
import { ExpertCategory } from '../../categories/models/expert-categories.model';
import {Seller} from "../../sellers/models/sellers.model";

interface ExpertCreateAttrs {
  project_id: number;
  category_id: number;
  supervisor_id: number;
  slug: string;
  email: string;
  available: string;
  avatar: string;
  rating: string;
  price: number;
  password: string;
  token: string;
  recommended: boolean;
}


@Table({
  tableName: 'experts',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Expert extends Model<Expert, ExpertCreateAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @ForeignKey(() => Project)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public project_id: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  public category_id: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  public supervisor_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: 1 })
  public recommended: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: 1 })
  public active: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: 0 })
  public available: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'f1d677a1-5e86-4fb3-acf8-4cec05e7534d.jpeg',
  })
  public avatar: string;

  @ApiProperty({ example: '5' })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 5 })
  public rating: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: 0 })
  public price: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({
    type: DataType.ENUM(...Object.values(Types)),
    allowNull: false,
    defaultValue: Types.Employee,
  })
  public type: Types;

  @Column({ type: DataType.TEXT, allowNull: true })
  public device_token: string;

  @BelongsTo(() => Project, 'project_id')
  public project: Project;

  @BelongsTo(() => Category, 'category_id')
  public category: Category;

  @HasOne(() => Seller)
  public seller: Seller;

  @HasMany(() => Service, { onDelete: 'cascade' })
  public services: Service[];

  @HasMany(() => ContactExpert, { onDelete: 'cascade' })
  public contacts: ContactExpert[];

  @HasMany(() => ExpertCategory, { onDelete: 'cascade' })
  public categories: ExpertCategory[];

  @HasMany(() => ParameterExpert, { onDelete: 'cascade' })
  public parameters: ParameterExpert[];

  @HasOne(() => ExpertTranslation, { onDelete: 'cascade' })
  public translation: ExpertTranslation;
}
