import {
  Column,
  DataType,
  HasOne,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Expert } from '../../experts/models/experts.model';
import { ModeTypes } from '../enums/mode-types.enum';

interface ProjectCreationAttrs {
  name: string;
  url: string;
  token: string;
  mode: ModeTypes;
}

@Table({
  tableName: 'projects',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Project extends Model<Project, ProjectCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  public id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public url: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public token: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModeTypes)),
    allowNull: false,
    defaultValue: ModeTypes.Development,
  })
  public mode: ModeTypes;

  @HasMany(() => Expert)
  public experts: Expert[];

  @HasOne(() => Expert, 'project_id')
  public administrator: Expert;
}
