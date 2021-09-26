import Head from 'next/head';
import styled from 'styled-components';
import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

export default function Home() {
  async function authenticate() {
    console.log('e');
  }

  return (
    <div>
      <Head>
        <title>Hacksquad 2021</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <MainHero>
              <HeadlineSpotText>The hacktoberfest team leaderboard</HeadlineSpotText>

              <h1>Hacksquad 2021</h1>
              <HeroDescription>Lorem ipsum dolores sit amet</HeroDescription>
              <CTAWrapper>
                <Button size="large">
                  <a href="http://localhost:3000/v1/auth/github">
                    <GithubOutlined /> Sign in with Github
                  </a>
                </Button>
              </CTAWrapper>
            </MainHero>
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroDescription = styled.p`
  color: #8c87a6;
  font-size: 18px;
  line-height: 32px;
  letter-spacing: -0.03em;
  margin-top: 20px;
`;

const CTAWrapper = styled.div`
  margin-top: 30px;

  button {
    span {
      font-weight: 500;
    }
  }
`;

const HeadlineSpotText = styled.div`
  margin-bottom: 25px;
  color: #e8805e;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const MainHero = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin-top: 100px;
  flex-direction: column;
  text-align: center;

  h1 {
    margin-top: 0px;
    margin-bottom: 24px;
    color: #fff;
    font-size: 64px;
    line-height: 32px;
    font-weight: 900;
  }
`;
