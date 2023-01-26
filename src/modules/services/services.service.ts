import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Service } from './models/services.model';
import { ServiceCreateDto } from './dto/service-create.dto';
import { ServiceUpdateDto } from './dto/service-update.dto';
import { ExpertsService } from '../experts/experts.service';
import { FilesService } from '../../common/files/files.service';
import {Category} from "../categories/models/categories.model";
import {Expert} from "../experts/models/experts.model";
import {ParameterExpert} from "../parameters/models/parameter-expert";
import {Parameter} from "../parameters/models/parameters.model";
import {Collection} from "../collections/models/collection.model";

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service) private serviceRepository: typeof Service,
    private expertService: ExpertsService,
    private fileService: FilesService,
  ) {}

  public async getAll(): Promise<Service[]> {
    return await this.serviceRepository.findAll({
      where: { project_id: AuthGuard.projectId },
      include: [{ model: Collection }],
    });
  }

  public async findById(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { id, project_id: AuthGuard.projectId },
      include: [{ model: Collection }],
    });
    if (!service) {
      throw new HttpException('Service was not found.', HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  public async findByHash(hash: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      rejectOnEmpty: undefined,
      where: { hash, project_id: AuthGuard.projectId },
      include: [{ model: Collection }],
    });
    if (!service) {
      throw new HttpException('Service was not found.', HttpStatus.BAD_REQUEST);
    }
    return service;
  }

  public async destroy(id: number): Promise<number> {
    await this.findById(id);
    return await this.serviceRepository.destroy({
      where: { id, project_id: AuthGuard.projectId },
    });
  }

  public async store(
    serviceDto: ServiceCreateDto,
    video: any,
  ): Promise<Service> {
    let fileName = null;
    if (video) {
      fileName = await this.fileService.createFile(video);
    }

    const service = await this.serviceRepository.create({
      ...serviceDto,
      video: fileName,
      project_id: Number(AuthGuard.projectId),
    });

    return await this.findById(service.id);
  }

  public async update(
    id: number,
    serviceDto: ServiceUpdateDto,
    video: any,
  ): Promise<Service> {
    if (video) {
      serviceDto.video = await this.fileService.createFile(video);
    }

    await this.serviceRepository.update(serviceDto, {
      returning: undefined,
      where: { id, project_id: AuthGuard.projectId },
    });
    return await this.findById(id);
  }

  public async findServicesByExpertId(expertId: number): Promise<Service[]> {
    const expert = await this.expertService.findById(expertId);
    if (!expert) {
      throw new HttpException('Expert is not found.', HttpStatus.BAD_REQUEST);
    }
    return await this.serviceRepository.findAll({
      order: [['id', 'DESC']],
      where: { expert_id: expertId, project_id: AuthGuard.projectId },
      include: [{ model: Collection }],
    });
  }
}
