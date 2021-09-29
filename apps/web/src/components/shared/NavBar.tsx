import styled from 'styled-components';
import Link from 'next/link';
import { AUTH_URL } from '../../shared/api';
import { trackAnalyticsEvent } from '../../shared/analytics.service';

export function NavigationBar() {
  return (
    <NavigationWrapper>
      <NavigationContainer>
        <div className="navigation-block-left">
          <Link href="/" passHref>
            <a aria-current="page" className="brand w-nav-brand w--current" aria-label="home">
              <img
                src="https://uploads-ssl.webflow.com/6130b55cdc153dd345632ef1/6150cd2a934a9402874d22b9_hacksquad-white.png"
                loading="lazy"
                height="45"
                alt=""
                className="logo"
              />
            </a>
          </Link>
        </div>
        <div className="navigation-right">
          <a href="#" className="nav-link-light mr10 w-inline-block">
            <div>Resources</div>
          </a>
          <a
            target="_blank"
            href="https://github.com/notifirehq/hacksquad"
            className="nav-link-light mr10 nav-link-large w-inline-block">
            <div className="text-block-3"></div>
          </a>
          <div className="account-buttons">
            <a
              href={AUTH_URL}
              className="navigation-link-dark-signup w-button"
              onClick={() => trackAnalyticsEvent('register:navbar')}>
              Join Now
            </a>
          </div>
          <div
            className="navigation-menu-dark w-nav-button"
            aria-label="menu"
            role="button"
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false">
            <div className="w-icon-nav-menu" />
          </div>
        </div>
      </NavigationContainer>
    </NavigationWrapper>
  );
}

const NavigationWrapper = styled.div`
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  min-height: 96px;
  padding-right: 3%;
  padding-left: 3%;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #0a071b;

  @media screen and (max-width: 991px) {
    position: relative;
  }
`;

const NavigationContainer = styled.div`
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 1280px;
  min-height: auto;
  margin-right: auto;
  margin-left: auto;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;

  @media screen and (max-width: 991px) {
    position: relative;
    -webkit-box-align: stretch;
    -webkit-align-items: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
  }
`;
