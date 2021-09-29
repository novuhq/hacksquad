import styled from 'styled-components';
import { Avatar, Button, Col, Divider, Input, message, Row, Tooltip } from 'antd';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import capitalize from 'lodash.capitalize';
import { IJwtPayload } from '@hacksquad/shared';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';
import { api } from '../shared/api';
import { isServerSide } from '../shared/utils';
import { getUser } from '../shared/auth.service';
import { trackAnalyticsEvent } from '../shared/analytics.service';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [user, setUser] = useState<IJwtPayload>();

  useEffect(() => {
    if (!isServerSide()) {
      const userData = getUser();
      setUser(userData);
    }

    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    const response = await api.get('/v1/leaderboard');

    setUserTeam(response.userTeam);
    setLeaderboard(response.leaderboard);
  }

  const INVITE_LINK = `https://hacksquad.dev/compete-invite?token=${user?.organizationId}`;

  return (
    <>
      <NavigationBar />
      <Row justify="center">
        <Col span={10}>
          <h1 className="hero-heading-white">
            The
            <br />
            <span style={{ color: '#5ec6e8' }}> Leaderboard.</span>
          </h1>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={10}>
          <LeaderBoardWrapper>
            {leaderboard.map((item) => {
              return <ListingItem key={item._id} data={item} />;
            })}
          </LeaderBoardWrapper>
        </Col>
      </Row>

      {userTeam?.position > 10 && (
        <Row justify="center">
          <Col span={10}>
            <LeaderBoardWrapper>
              <ListingItem data={userTeam} />
            </LeaderBoardWrapper>
          </Col>
        </Row>
      )}

      <Divider />
      {user?.organizationId && (
        <Row justify="center" style={{ marginBottom: 30 }}>
          <Col span={10}>
            <h1 style={{ fontSize: 24, marginBottom: 10, lineHeight: '24px' }} className="hero-heading-white">
              Invite your Co-workers to compete
            </h1>

            <p>Got your squad ready? Invite some other squads to play against. And let the best squad win :)</p>

            <Input
              style={{ backgroundColor: '#999', border: 'none', maxWidth: 500 }}
              size="large"
              readOnly
              value={`https://hacksquad.dev/compete-invite?token=${user?.organizationId}`}
              addonAfter={(
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      navigator.clipboard.writeText(INVITE_LINK);
                      message.success('Invite link copied successfully');
                      trackAnalyticsEvent('leaderboards:copy-link');
                    }}>
                    Copy Link
                  </Button>
                </>
              )}
            />
          </Col>
        </Row>
      )}

      <Footer />
    </>
  );
}

function ListingItem({ data }: { data: any }) {
  return (
    <ItemWrapper>
      <AvatarWrapper style={{ maxWidth: '300px' }}>
        <PositionCount>#{data.position}</PositionCount>
        <Avatar
          shape="square"
          style={{ backgroundColor: data.squad.color || '#5C7AEA', minWidth: 40 }}
          size={40}
          src={data.logo}>
          {data.squad.name[0]}
        </Avatar>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
          {capitalize(data.squad?.name)}
        </span>
      </AvatarWrapper>

      <div style={{ display: 'flex' }}>
        <StatsWrapper>
          <Tooltip title="Total team accepted or merged pull requests">
            <span>
              <b>{data.commits} </b>
              PRS
            </span>
          </Tooltip>
          <Tooltip title="Lines of code added">
            <span>
              <b>{data.linesAdded} </b>
              LOCA
            </span>
          </Tooltip>
{' '}
          <Tooltip title="Lines of code removed">
            <span>
              <b>{data.linesRemoved} </b>
              LOCR
            </span>
          </Tooltip>
        </StatsWrapper>
        <div
          style={{ width: 150, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar.Group>
            {data.squad?.members.map((member) => {
              return (
                <Tooltip key={member._id} title={`${capitalize(member.firstName)}`} placement="top">
                  <a target="_blank" href={`https://github.com/${member.username}`}>
                    <Avatar
                      style={{ backgroundColor: '#87d068' }}
                      src={member.profilePicture}
                      icon={<UserOutlined />}
                    />
                  </a>
                </Tooltip>
              );
            })}
          </Avatar.Group>
        </div>
      </div>
    </ItemWrapper>
  );
}

const StatsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  font-weight: normal;

  span {
    padding: 0 5px;

    b {
      font-size: 12px;
    }
  }
`;

const PositionCount = styled.div`
  font-weight: bold;
  color: #5e5e5e;
  margin-left: 10px;
`;

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
  > span {
    margin-left: 15px;
  }
`;

const ItemWrapper = styled.div`
  background: #eeeeee;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

const LeaderBoardWrapper = styled.div`
  margin-bottom: 100px;
`;
