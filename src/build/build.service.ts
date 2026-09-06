import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Build } from './entities/build.entity';
import { Equipment } from '../equipment/entities/equipment.entity';
import { EquipmentSlot } from '../equipment/enums/equipment-slot.enum';

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

  async getBuildByUserId(userId: string): Promise<Build> {
    const build = await this.buildRepo.findOne({
      where: {
        inventory: {
          userId: userId,
        },
      },
    });

    if (!build) {
      throw new NotFoundException(`Build not found for user ${userId}`);
    }

    return build;
  }

  async equip(
    userId: string,
    slot: EquipmentSlot,
    equipment: Equipment,
  ): Promise<Build> {
    const build = await this.getBuildByUserId(userId);
    build[slot] = equipment;
    await this.buildRepo.save(build);
    return build;
  }

  async unequip(userId: string, equipmentSlot: EquipmentSlot): Promise<Build> {
    const build = await this.getBuildByUserId(userId);
    build[equipmentSlot] = null;
    await this.buildRepo.save(build);
    return build;
  }

  async saveBuild(build: Build): Promise<Build> {
    return await this.buildRepo.save(build);
  }
}
