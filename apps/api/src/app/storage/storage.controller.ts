import { Body, ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { IJwtPayload } from '@hacksquad/shared';
import { AuthGuard } from '@nestjs/passport';
import { GetSignedUrl } from './usecases/get-signed-url/get-signed-url.usecase';
import { GetSignedUrlCommand } from './usecases/get-signed-url/get-signed-url.command';
import { UserSession } from '../shared/framework/user.decorator';

@Controller('/storage')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private getSignedUrlUsecase: GetSignedUrl) {}

  @Get('/upload-url')
  async signedUrl(@UserSession() user: IJwtPayload, @Query('extension') extension: string) {
    return await this.getSignedUrlUsecase.execute(
      GetSignedUrlCommand.create({
        userId: user._id,
        extension,
      })
    );
  }
}
