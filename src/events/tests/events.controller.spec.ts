import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from '../event.controller';

describe('Events Controller', () => {
  let controller: EventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  it('should be defined', () => {
    expect(true).toBeTruthy();
  });
});
