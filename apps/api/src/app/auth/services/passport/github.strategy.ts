import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as githubPassport from 'passport-github';
import { Metadata, StateStoreStoreCallback, StateStoreVerifyCallback } from 'passport-oauth2';
import { AuthProviderEnum } from '@hacksquad/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(githubPassport.Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_REDIRECT,
      passReqToCallback: true,
      store: {
        verify(req, state: string, meta: Metadata, callback: StateStoreVerifyCallback) {
          callback(null, true, {
            token: req.query.token,
            promotionalsEnabled: req.query.promotionalsEnabled,
            termsAndConditions: req.query.termsAndConditions,
          });
        },
        store(req, meta: Metadata, callback: StateStoreStoreCallback) {
          callback(
            null,
            JSON.stringify({
              token: req.query.token,
              promotionalsEnabled: req.query.promotionalsEnabled,
              termsAndConditions: req.query.termsAndConditions,
            })
          );
        },
      },
    });
  }

  async validate(req, accessToken: string, refreshToken: string, profile, done: (err, data) => void) {
    try {
      let parsedState;
      try {
        parsedState = JSON.parse(req.query.state);
      } catch (e) {}

      const response = await this.authService.authenticate(
        AuthProviderEnum.GITHUB,
        accessToken,
        refreshToken,
        profile._json,
        parsedState
      );

      done(null, {
        token: response.token,
        newUser: response.newUser,
      });
    } catch (err) {
      done(err, false);
    }
  }
}
