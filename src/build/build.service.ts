import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Build } from './entities/build.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentType } from '../equipment/enums/equipment-type.enum';

@Injectable()
export class BuildService {
  constructor(
    @InjectRepository(Build)
    private buildRepo: Repository<Build>,
  ) {}

  async createBuild(inventoryId: string): Promise<Build> {
    const build = this.buildRepo.create({
      inventoryId,
      weaponId: null,
      offhandId: null,
      helmetId: null,
      armorId: null,
      bootsId: null,
    });

    return await this.buildRepo.save(build);
  }

  async getBuildByInventoryId(inventoryId: string): Promise<Build> {
    const build = await this.buildRepo.findOne({
      where: { inventoryId },
      relations: {
        weapon: true,
        offhand: true,
        helmet: true,
        armor: true,
        boots: true,
      },
    });

    if (!build) {
      throw new NotFoundException('Build not found');
    }

    return build;
  }

  async equipItem(
    inventoryId: string,
    slot: EquipmentType,
    equipment: Equipment,
  ): Promise<Build> {
    const build = await this.getBuildByInventoryId(inventoryId);
    build[slot] = equipment;
    await this.buildRepo.save(build);
    return this.getBuildByInventoryId(inventoryId);
  }

  async unequipItem(
    inventoryId: string,
    equipmentType: EquipmentType,
  ): Promise<Build> {
    const build = await this.getBuildByInventoryId(inventoryId);
    build[equipmentType] = null;
    await this.buildRepo.save(build);
    return this.getBuildByInventoryId(inventoryId);
  }

  async saveBuild(build: Build): Promise<Build> {
    return await this.buildRepo.save(build);
  }
}
